import { createAsyncThunk } from "@reduxjs/toolkit";
import { ChatCompletionMessage, ChatCompletionRole } from "../../../models/chat";
import { addChatMessage, setStreamData, updateConversation } from "../conversationSlice";
import { idb } from "../../database";
import { Conversation } from "../../../models/conversation";

export const postChatCompletion = createAsyncThunk(
  "conversation/postChatCompletion",
  async ({ id, messages }: {
    id: string;
    messages: ChatCompletionMessage[];
  }, { dispatch, signal }) => {
    const completion = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages,
        stream: true,
      }),
    });

    // Add empty message in state so that when stream data comes in
    // it can update to it directly to give a typing effect
    dispatch(addChatMessage({
      id,
      messages: [
        { role: ChatCompletionRole.ASSISTANT, content: "" }
      ],
    }));

    // Convert text stream to UTF-8, then lock it to reader
    const reader = completion.body
      .pipeThrough(new TextDecoderStream(), { signal })
      .getReader();

    let content = "";
    
    // Read stream chunks sequentially, then parse each chunk to readable text
    while (true) {
      if (signal.aborted)
        throw new Error("Chat completion has been aborted");

      const res = await reader?.read();
      if (res?.done) break;

      const data = res.value;

      // Split data chunks delimited by \n\n
      const lines = data.split("\n\n")
        .filter(line => line.length > 0 && !line.includes("[DONE]"));
      
      // Convert chunks to JSON and extract text content
      for (const line of lines) {
        const clean = line.replace("data: ", "");
        const json = JSON.parse(clean);

        const token = json.choices[0].delta.content;

        if (token) {
          content += token;
          dispatch(setStreamData(token));
        }
      }
    }

    // Persist completed streamed data to IDB once
    await idb.then(db => {
      const objectStore = db
        .transaction(["conversations"], "readwrite")
        .objectStore("conversations");
      const request = objectStore.get(id);

      request.onsuccess = () => {
        const convo: Conversation = request.result;
        const msgs = convo.messages;
        let last = msgs.length - 1;

        const lastMsg = msgs[last];

        if (lastMsg.role === ChatCompletionRole.USER) {
          msgs.push({
            role: ChatCompletionRole.ASSISTANT,
            content: ""
          });
          last++;
        }

        msgs[last] = {
          ...msgs[last],
          content: msgs[last].content + content,
        };
        convo.messages = msgs;

        const requestUpdate = objectStore.put(convo, convo.id);

        requestUpdate.onsuccess = () => {
          console.log(`[postChatCompletion] Chat completion successfully appended to messages for conversation ${convo.id}`);
          dispatch(updateConversation(convo));
        };

        requestUpdate.onerror = () => {
          throw new Error(`Cannot update messages for conversation ${convo.id}`);
        };
      };

      request.onerror = () => {
        throw new Error(`Cannot get conversation with ID ${id}`);
      };
    });
  }
);

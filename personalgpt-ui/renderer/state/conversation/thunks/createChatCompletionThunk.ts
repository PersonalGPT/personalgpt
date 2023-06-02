import { createAsyncThunk } from "@reduxjs/toolkit";
import { ChatCompletionMessage, ChatCompletionRole } from "../../../models/chat";
import { addChatMessage, setStreamData } from "../conversationSlice";

export const createChatCompletion = createAsyncThunk(
  "conversation/createChatCompletion",
  async ({ id, messages }: {
    id: string;
    messages: ChatCompletionMessage[];
  }, { dispatch, signal }) => {
    const response = await fetch(`${process.env.PERSONALGPT_SERVER_URL}/api/v1/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, messages }),
      signal,
    }).catch(err => {
      throw err;
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
    const reader = response.body
      .pipeThrough(new TextDecoderStream(), { signal })
      .getReader();

    // Read stream chunks sequentially, then parse each chunk to readable text
    while (true) {
      if (signal.aborted)
        throw new Error("Chat completion has been aborted");

      const res = await reader?.read();
      if (res?.done) break;
      dispatch(setStreamData(res.value));
    }
  }
);

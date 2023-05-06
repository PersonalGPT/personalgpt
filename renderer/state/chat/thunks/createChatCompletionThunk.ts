import { createAsyncThunk } from "@reduxjs/toolkit";
import { ChatCompletionMessage, ChatCompletionRole } from "../../../models/chat";
import { addChatMessage, setStreamData } from "../chatSlice";

export const createChatCompletion = createAsyncThunk(
  "chat/createCompletion",
  async ({ id, messages }: {
    id: string;
    messages: ChatCompletionMessage[];
  }, { dispatch, signal }) => {
    const response = await fetch(`${process.env.BETTERGPT_SERVER_URL}/api/v1/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, messages }),
      signal,
    }).catch((err) => {
      throw err;
    });

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

    // Read stream chunks sequentially, text is already made readable
    while (true) {
      if (signal.aborted)
        throw new Error("Chat completion has been aborted");

      const res = await reader?.read();
      if (res?.done) break;
      dispatch(setStreamData(res.value));
    }
  }
);

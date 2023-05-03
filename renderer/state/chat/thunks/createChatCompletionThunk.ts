import { createAsyncThunk } from "@reduxjs/toolkit";
import { ChatCompletionMessage } from "../../../models/chat";
import { setStreamData } from "../chatSlice";

export const createChatCompletion = createAsyncThunk(
  "chat/createCompletion",
  async (messages: ChatCompletionMessage[], { dispatch, signal }) => {
    const response = await fetch(`${process.env.BETTERGPT_SERVER_URL}/api/v1/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages
      }),
      signal,
    }).catch((err) => {
      throw err;
    });

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

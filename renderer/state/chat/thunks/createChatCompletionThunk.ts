import { createAsyncThunk } from "@reduxjs/toolkit";
import { ChatCompletionMessage } from "../../../models/chat";
import { appendStreamData } from "../chatSlice";

export const createChatCompletion = createAsyncThunk(
  "chat/createCompletion",
  async (messages: ChatCompletionMessage[], thunkAPI) => {
    const response = await fetch(`${process.env.BETTERGPT_SERVER_URL}/api/v1/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages
      }),
    });

    if (!response.ok)
      throw new Error(`Failed to start stream: ${response.status} ${response.statusText}`);

    // Convert text stream to UTF-8, then lock it to reader
    const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();

    // Read stream chunks sequentially, text is already made readable
    while (true) {
      const res = await reader?.read();
      if (res?.done) break;
      thunkAPI.dispatch(appendStreamData(res.value));
    }
  }
);

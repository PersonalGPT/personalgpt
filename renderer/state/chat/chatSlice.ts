import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ChatCompletionMessage } from "../../models/chat";
import { RootState } from "../store";
import { createChatCompletion } from "./thunks/createChatCompletionThunk";

export interface ChatState {
  conversation: ChatCompletionMessage[];
  prompt: string;
  streamData: string;
}

const initialState = {
  conversation: [],
  prompt: "",
  streamData: "",
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addChatMessage: (state, action: PayloadAction<ChatCompletionMessage | ChatCompletionMessage[]>) => {
      state.conversation = state.conversation.concat(action.payload);
    },
    appendToLastMessage: (state, action: PayloadAction<string>) => {
      const convo = state.conversation;
      const last = convo[convo.length - 1];

      convo[convo.length - 1] = {
        ...last,
        content: last.content + action.payload,
      };

      state.conversation = convo;
    },
    setPrompt: (state, action: PayloadAction<string>) => {
      state.prompt = action.payload;
    },
    setStreamData: (state, action: PayloadAction<string>) => {
      state.streamData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createChatCompletion.fulfilled, (state, action) => {
      state.streamData = "";
    });
  }
});

export const {
  addChatMessage,
  appendToLastMessage,
  setPrompt,
  setStreamData,
} = chatSlice.actions;

export const selectConversation = (state: RootState) => state.chat.conversation;
export const selectPrompt = (state: RootState) => state.chat.prompt;
export const selectStreamData = (state: RootState) => state.chat.streamData;

export default chatSlice.reducer;

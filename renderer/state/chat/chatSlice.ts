import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ChatCompletionMessage, ChatCompletionRole } from "../../models/chat";
import { RootState } from "../store";

export interface ChatState {
  conversation: ChatCompletionMessage[];
  prompt: string;
}

const initialState = {
  conversation: [],
  prompt: "",
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addChatMessage: (state, action: PayloadAction<ChatCompletionMessage | ChatCompletionMessage[]>) => {
      state.conversation = state.conversation.concat(action.payload);
    },
    editLastMessage: (state, action: PayloadAction<string>) => {
      const convo = state.conversation;
      const last = convo.length - 1;

      convo[last] = {
        ...convo[last],
        content: action.payload,
      };

      state.conversation = convo;
    },
    setPrompt: (state, action: PayloadAction<string>) => {
      state.prompt = action.payload;
    },
  },
});

export const {
  addChatMessage,
  editLastMessage,
  setPrompt
} = chatSlice.actions;

export const selectConversation = (state: RootState) => state.chat.conversation;
export const selectPrompt = (state: RootState) => state.chat.prompt;

export default chatSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ChatCompletionMessage } from "../../models/chat";
import { RootState } from "../store";
import { createChatCompletion } from "./thunks/createChatCompletionThunk";
import { Conversation } from "../../models/conversation";
import { conversationApi } from "../services/conversation";

export interface ChatState {
  isLoading: boolean;
  conversations: { [id: string]: Conversation };
  streamData: string;
  currentConversationId: string | null;
}

const initialState: ChatState = {
  isLoading: false,
  conversations: {},
  streamData: "",
  currentConversationId: null,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addChatMessage: (state, action: PayloadAction<{
      id: string;
      messages: ChatCompletionMessage | ChatCompletionMessage[];
    }>) => {
      const { id, messages } = action.payload;
      const convo = state.conversations[id];
      let msgs = convo.messages;

      msgs = msgs.concat(messages);
      state.conversations[id] = {
        ...convo,
        messages: msgs,
      };
    },
    appendToLastMessage: (state, action: PayloadAction<{
      id: string;
      contentToAppend: string;
    }>) => {
      const { id, contentToAppend } = action.payload;

      const convo: Conversation = state.conversations[id];
      const messages = convo.messages;
      const last = messages[messages.length - 1];

      messages[messages.length - 1] = {
        ...last,
        content: last.content + contentToAppend,
      };

      state.conversations[id] = convo;
    },
    setCurrentConversationId: (state, action: PayloadAction<string>) => {
      state.currentConversationId = action.payload;
    },
    setStreamData: (state, action: PayloadAction<string>) => {
      state.streamData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createChatCompletion.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(createChatCompletion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.streamData = "";
      })
      .addCase(createChatCompletion.rejected, (state, action) => {
        state.isLoading = false;
        state.streamData = "";
      });

    builder.addMatcher(
      conversationApi.endpoints.updateConversationMessages.matchFulfilled,
      (state, { payload }) => {
        state.conversations[payload.id] = { ...payload };
      }
    );

    builder.addMatcher(
      conversationApi.endpoints.deleteConversation.matchFulfilled,
      (state, { meta }) => {
        const { id } = meta.arg.originalArgs;

        delete state.conversations[id];
      }
    );
  }
});

export const {
  addChatMessage,
  appendToLastMessage,
  setCurrentConversationId,
  setStreamData,
} = chatSlice.actions;

export const selectIsChatLoading = (state: RootState) => state.chat.isLoading;
export const selectConversations = (state: RootState) => state.chat.conversations;
export const selectConversationById = (id: string) =>
  (state: RootState): Conversation => state.chat.conversations[id];
export const selectStreamData = (state: RootState) => state.chat.streamData;
export const selectCurrentConversationId = (state: RootState) => state.chat.currentConversationId;

export default chatSlice.reducer;

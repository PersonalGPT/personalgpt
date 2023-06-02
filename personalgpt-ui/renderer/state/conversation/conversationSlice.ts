import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Conversation } from "../../models/conversation";
import { createChatCompletion } from "./thunks";
import { ChatCompletionMessage } from "../../models/chat";
import { conversationApi } from "../services/conversation";

export interface ConversationState {
  isLoading: boolean;
  conversations: { [id: string]: Conversation };
  currentConversationId: string;
  streamData: string;
}

const initialState: ConversationState = {
  isLoading: false,
  conversations: {},
  currentConversationId: undefined,
  streamData: "",
};

export const conversationSlice = createSlice({
  name: "conversation",
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
      .addCase(createChatCompletion.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createChatCompletion.fulfilled, (state) => {
        state.isLoading = false;
        state.streamData = "";
      })
      .addCase(createChatCompletion.rejected, (state) => {
        state.isLoading = false;
        state.streamData = "";
      });

    builder.addMatcher(
      conversationApi.endpoints.getAllConversations.matchFulfilled,
      (state, { payload }) => {
        payload.forEach(preview => {
          state.conversations[preview.id] = {
            ...preview,
            messages: [],
          };
        });
        state.currentConversationId = null;
      }
    );

    builder.addMatcher(
      conversationApi.endpoints.getConversationById.matchFulfilled,
      (state, { payload }) => {
        state.conversations[payload.id] = { ...payload };
        state.currentConversationId = payload.id;
      }
    );

    builder.addMatcher(
      conversationApi.endpoints.createConversation.matchFulfilled,
      (state, { payload }) => {
        state.conversations[payload.id] = { ...payload };
        state.currentConversationId = payload.id;
      }
    );

    builder.addMatcher(
      conversationApi.endpoints.updateConversationTitle.matchFulfilled,
      (state, { payload }) => {
        state.conversations[payload.id] = { ...payload };
      }
    );

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
} = conversationSlice.actions;

export const selectIsChatLoading = (state: RootState) => state.conversation.isLoading;
export const selectConversations = (state: RootState) => state.conversation.conversations;
export const selectConversationById = (id: string) =>
  (state: RootState): Conversation => state.conversation.conversations[id];
export const selectCurrentConversationId = (state: RootState) => state.conversation.currentConversationId;
export const selectStreamData = (state: RootState) => state.conversation.streamData;

export default conversationSlice.reducer;

import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Conversation, ConversationPreview } from "../../models/conversation";
import { postChatCompletion } from "./thunks";
import { ChatCompletionMessage } from "../../models/chat";

export interface ConversationState {
  isLoading: boolean;
  arePreviewsFetched: boolean;
  conversations: { [id: string]: Conversation };
  currentConversationId: string;
  streamData: string;
}

const initialState: ConversationState = {
  isLoading: false,
  arePreviewsFetched: false,
  conversations: {},
  currentConversationId: undefined,
  streamData: "",
};

export const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    createConversation: (state, action: PayloadAction<Conversation>) => {
      const conversation = action.payload;

      state.conversations[conversation.id] = conversation;
      state.currentConversationId = conversation.id;
    },
    loadConversationPreviews: (state, action: PayloadAction<ConversationPreview[]>) => {
      const previews = action.payload;

      previews.forEach(preview => {
        state.conversations[preview.id] = {
          ...preview,
          messages: [],
        };
      });
      state.arePreviewsFetched = true;
      state.currentConversationId = null;
    },
    loadFullConversation: (state, action: PayloadAction<Conversation>) => {
      const conversation = action.payload;

      state.conversations[conversation.id] = conversation;
      state.currentConversationId = conversation.id;
    },
    updateConversation: (state, action: PayloadAction<Conversation>) => {
      const conversation = action.payload;

      state.conversations[conversation.id] = conversation;
    },
    removeConversation: (state, action: PayloadAction<string>) => {
      const id = action.payload;

      delete state.conversations[id];
    },
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
      .addCase(postChatCompletion.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(postChatCompletion.fulfilled, (state) => {
        state.isLoading = false;
        state.streamData = "";
      })
      .addCase(postChatCompletion.rejected, (state) => {
        state.isLoading = false;
        state.streamData = "";
      });
  }
});

export const {
  createConversation,
  loadConversationPreviews,
  loadFullConversation,
  updateConversation,
  removeConversation,
  addChatMessage,
  appendToLastMessage,
  setCurrentConversationId,
  setStreamData,
} = conversationSlice.actions;

export const selectIsChatLoading = (state: RootState) => state.conversation.isLoading;
export const selectArePreviewsFetched = (state: RootState) => state.conversation.arePreviewsFetched;
export const selectConversations = (state: RootState) => state.conversation.conversations;
export const selectConversationById = (id: string) =>
  (state: RootState): Conversation => state.conversation.conversations[id];
export const selectCurrentConversationId = (state: RootState) => state.conversation.currentConversationId;
export const selectStreamData = (state: RootState) => state.conversation.streamData;

export default conversationSlice.reducer;

import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Conversation, ConversationPreview } from "../../models/conversation";

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
    setCurrentConversationId: (state, action: PayloadAction<string>) => {
      state.currentConversationId = action.payload;
    },
    setStreamData: (state, action: PayloadAction<string>) => {
      state.streamData = action.payload;
    },
  },
});

export const {
  createConversation,
  loadConversationPreviews,
  loadFullConversation,
  updateConversation,
  removeConversation,
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

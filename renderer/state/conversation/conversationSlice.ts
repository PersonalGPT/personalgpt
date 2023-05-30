import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Conversation, ConversationPreview, createNewConversation } from "../../models/conversation";
import { ChatCompletionRole } from "../../models/chat";
import { idb } from "../database";

export interface ConversationState {
  conversations: { [id: string]: Conversation };
  currentConversationId: string;
}

const initialState: ConversationState = {
  conversations: {},
  currentConversationId: undefined,
};

export const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    createConversation: (state, action: PayloadAction<{ prompt: string }>) => {
      const { prompt } = action.payload;
      const conversation = createNewConversation({
        title: prompt,
        messages: [
          { role: ChatCompletionRole.USER, content: prompt },
        ],
      });

      idb.then(db => {
        const request = db
          .transaction(["conversations"], "readwrite")
          .objectStore("conversations")
          .put(conversation, conversation.id);

        request.onsuccess = () => {
          console.log(`Conversation created successfully with ID ${request.result}`);
        };
      });

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
  },
});

export const {
  createConversation,
  loadConversationPreviews,
} = conversationSlice.actions;

export const selectConversations = (state: RootState) => state.conversation.conversations;
export const selectConversationById = (id: string) =>
  (state: RootState): Conversation => state.conversation.conversations[id];
export const selectCurrentConversationId = (state: RootState) => state.conversation.currentConversationId;

export default conversationSlice.reducer;

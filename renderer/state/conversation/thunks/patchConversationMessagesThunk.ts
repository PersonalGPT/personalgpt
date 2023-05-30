import { createAsyncThunk } from "@reduxjs/toolkit";
import { ChatCompletionMessage } from "../../../models/chat";
import { idb } from "../../database";
import { Conversation } from "../../../models/conversation";
import { updateConversation } from "../conversationSlice";

export const patchConversationMessages = createAsyncThunk(
  "conversation/patchMessages",
  async ({ id, messages }: {
    id: string;
    messages: ChatCompletionMessage[];
  }, { dispatch }) => {
    await idb.then(db => {
      const objectStore = db
        .transaction(["conversations"], "readwrite")
        .objectStore("conversations");
      const request = objectStore.get(id);

      request.onsuccess = () => {
        const convo: Conversation = request.result;
        convo.messages = messages;

        const requestUpdate = objectStore.put(convo, convo.id);

        requestUpdate.onsuccess = () => {
          console.log(`[patchConversationMessages] Messages successfully updated for conversation ${convo.id}`);
          dispatch(updateConversation(convo));
        };

        requestUpdate.onerror = () => {
          throw new Error(`Cannot update messages for conversation ${convo.id}`);
        };
      };

      request.onerror = () => {
        throw new Error(`Cannot get conversation with ID ${id}`);
      };
    });
  }
);

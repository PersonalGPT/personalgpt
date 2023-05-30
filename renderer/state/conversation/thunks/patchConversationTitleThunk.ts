import { createAsyncThunk } from "@reduxjs/toolkit";
import { idb } from "../../database";
import { Conversation } from "../../../models/conversation";
import { updateConversation } from "../conversationSlice";

export const patchConversationTitle = createAsyncThunk(
  "conversation/patchTitle",
  async ({ id, title }: {
    id: string;
    title: string;
  }, { dispatch }) => {
    await idb.then(db => {
      const objectStore = db
        .transaction(["conversations"], "readwrite")
        .objectStore("conversations");
      const request = objectStore.get(id);

      request.onsuccess = () => {
        const convo: Conversation = request.result;
        convo.title = title;

        const requestUpdate = objectStore.put(convo, convo.id);

        requestUpdate.onsuccess = () => {
          console.log(`[patchConversationTitle] Title successfully updated for conversation ${convo.id}`);
          dispatch(updateConversation(convo));
        };

        requestUpdate.onerror = () => {
          throw new Error(`Cannot update title for conversation ${convo.id}`);
        };
      };

      request.onerror = () => {
        throw new Error(`Cannot get conversation with ID ${id}`);
      };
    });
  }
);

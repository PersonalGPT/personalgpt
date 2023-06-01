import { createAsyncThunk } from "@reduxjs/toolkit";
import { idb } from "../../database";
import { removeConversation } from "../conversationSlice";

export const deleteConversation = createAsyncThunk(
  "conversation/delete",
  async (id: string, { dispatch }) => {
    await idb.then(db => {
      const request = db
        .transaction(["conversations"], "readwrite")
        .objectStore("conversations")
        .delete(id);

      request.onsuccess = () => {
        console.log(`[deleteConversation] Successfully deleted conversation ${id}`)
        dispatch(removeConversation(id));
      };

      request.onerror = () => {
        throw new Error(`Cannot delete conversation ${id}`);
      };
    });
  }
);

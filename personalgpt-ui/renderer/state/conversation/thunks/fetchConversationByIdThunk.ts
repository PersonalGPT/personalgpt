import { createAsyncThunk } from "@reduxjs/toolkit";
import { idb } from "../../database";
import { loadFullConversation } from "../conversationSlice";

export const fetchConversationById = createAsyncThunk(
  "conversation/fetchById",
  async (id: string, { dispatch }) => {
    await idb.then(db => {
      const request = db
        .transaction(["conversations"], "readonly")
        .objectStore("conversations")
        .get(id);

      request.onsuccess = () => {
        console.log(`[fetchById] Conversation with ID ${id} retrieved successfully`);
        dispatch(loadFullConversation(request.result));
      };

      request.onerror = () => {
        throw new Error(`Cannot get conversation with ID ${id}`);
      };
    });
  }
);

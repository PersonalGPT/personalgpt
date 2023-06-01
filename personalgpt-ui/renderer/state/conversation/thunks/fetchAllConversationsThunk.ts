import { createAsyncThunk } from "@reduxjs/toolkit";
import { idb } from "../../database";
import { loadConversationPreviews } from "../conversationSlice";

export const fetchAllConversations = createAsyncThunk(
  "conversation/fetchAll",
  async (_, { dispatch }) => {
    await idb.then(db => {
      const request = db
        .transaction(["conversations"], "readonly")
        .objectStore("conversations")
        .getAll();

      request.onsuccess = () => {
        console.log("[fetchAll] Conversations retrieved successfully");
        dispatch(loadConversationPreviews(request.result));
      };

      request.onerror = () => {
        throw new Error("Cannot get all conversations");
      };
    });
  }
);

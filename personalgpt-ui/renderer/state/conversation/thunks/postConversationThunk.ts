import { createAsyncThunk } from "@reduxjs/toolkit";
import { idb } from "../../database";
import { createNewConversation } from "../../../models/conversation";
import { ChatCompletionRole } from "../../../models/chat";
import { createConversation } from "../conversationSlice";

export const postConversation = createAsyncThunk(
  "conversation/post",
  async ({ prompt }: {
    prompt: string
  }, { dispatch }) => {
    const conversation = createNewConversation({
      title: prompt,
      messages: [
        { role: ChatCompletionRole.USER, content: prompt },
      ],
    });

    await idb.then(db => {
      const request = db
        .transaction(["conversations"], "readwrite")
        .objectStore("conversations")
        .put(conversation, conversation.id);

      request.onsuccess = () => {
        console.log(`[postConversation] Conversation create successfully with ID ${request.result}`)
        dispatch(createConversation(conversation));
      };

      request.onerror = () => {
        throw new Error("Cannot create new conversation");
      };
    });
  }
);

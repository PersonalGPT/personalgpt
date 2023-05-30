import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Conversation } from "../../models/conversation";

export const conversationApi = createApi({
  reducerPath: "conversationApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.BETTERGPT_SERVER_URL}/api/v1` }),
  endpoints: (builder) => ({
    updateConversationMessages: builder.mutation<Conversation, Pick<Conversation, "id" | "messages">>({
      query: ({ id, messages }: Pick<Conversation, "id" | "messages">) => ({
        url: "/conversations",
        method: "PATCH",
        body: { id, messages },
      }),
    }),
    deleteConversation: builder.mutation<boolean, Pick<Conversation, "id">>({
      query: ({ id }: Pick<Conversation, "id">) => ({
        url: `/conversations/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useUpdateConversationMessagesMutation,
  useDeleteConversationMutation,
} = conversationApi;

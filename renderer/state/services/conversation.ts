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
  }),
});

export const {
  useUpdateConversationMessagesMutation,
} = conversationApi;

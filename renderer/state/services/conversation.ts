import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Conversation, ConversationPreview } from "../../models/conversation";

export const conversationApi = createApi({
  reducerPath: "conversationApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.BETTERGPT_SERVER_URL}/api/v1` }),
  endpoints: (builder) => ({
    getAllConversations: builder.query<ConversationPreview[], void>({
      query: () => "/conversations",
    }),
    getConversationById: builder.query<Conversation, string>({
      query: (id: string) => `/conversations/${id}`,
    }),
    createConversation: builder.mutation<Conversation, { prompt: string }>({
      query: ({ prompt }: { prompt: string }) => ({
        url: "/conversations",
        method: "POST",
        body: { prompt },
      }),
    }),
  }),
});

export const {
  useGetAllConversationsQuery,
  useGetConversationByIdQuery,
  useCreateConversationMutation,
} = conversationApi;

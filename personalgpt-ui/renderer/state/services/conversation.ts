import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Conversation, ConversationPreview } from "../../models/conversation";

export const conversationApi = createApi({
  reducerPath: "conversationApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.PERSONALGPT_SERVER_URL}/api/v1` }),
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
    updateConversationMessages: builder.mutation<Conversation, Pick<Conversation, "id" | "messages">>({
      query: ({ id, messages }: Pick<Conversation, "id" | "messages">) => ({
        url: "/conversations",
        method: "PATCH",
        body: { id, messages },
      }),
    }),
    updateConversationTitle: builder.mutation<Conversation, Pick<Conversation, "id" | "title">>({
      query: ({ id, title }: Pick<Conversation, "id" | "title">) => ({
        url: "/conversations",
        method: "PATCH",
        body: { id, title },
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
  useGetAllConversationsQuery,
  useGetConversationByIdQuery,
  useCreateConversationMutation,
  useUpdateConversationMessagesMutation,
  useUpdateConversationTitleMutation,
  useDeleteConversationMutation,
} = conversationApi;

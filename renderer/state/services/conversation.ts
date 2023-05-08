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
  }),
});

export const {
  useGetAllConversationsQuery,
  useGetConversationByIdQuery,
  useCreateConversationMutation,
  useUpdateConversationMessagesMutation,
  useUpdateConversationTitleMutation,
} = conversationApi;

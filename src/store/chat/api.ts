import { createApi } from "@reduxjs/toolkit/query/react";
import {baseQuery} from "@/lib/utils.ts";

interface Message {
  _id: string;
  role: string;
  content: string;
  created_at: string;
}

interface Conversation {
  _id: string;
  user_id: string;
  title: string;
  messages: Message[];
  ended: boolean;
    summary?: string | null;
    summary_created_at?: string | null;
  created_at: string;
  updated_at: string;
}

interface ConversationSummary {
    conversation_id: string;
    summary: string;
    summary_created_at: string | null;
}

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: baseQuery,
    tagTypes: ["Conversations", "ChatSummary"],

    endpoints: (builder) => ({
        startConversation: builder.mutation<any,void>({
            query: () => ({
                url: `/chat/start`,
                method: "POST",
                body: {},
            }),
            transformResponse: (data: any) => data.conversation || [],
            invalidatesTags: ["Conversations"],
        }),
        
        getConversations: builder.query<Conversation[], void>({
            query: () => ({
                url: `/chat`,
                method: "GET",
            }),
            transformResponse: (data: any) => data.conversations || [],
            providesTags: ["Conversations"],
        }),
        
        getConversation: builder.query<Conversation, string>({
            query: (conversationId) => ({
                url: `/chat/${conversationId}`,
                method: "GET",
            }),
            transformResponse: (data: any) => data.conversation,
            providesTags: ["Conversations"],
        }),
        
        checkActiveConversation: builder.query<any, void>({
            query: () => ({
                url: `/chat/check-active`,
                method: "GET",
            }),
            transformResponse: (data: any) => data,
            providesTags: ["Conversations"],
        }),
        
        endConversation: builder.mutation<any, string>({
            query: (conversationId) => ({
                url: `/chat/${conversationId}/end`,
                method: "POST",
            }),
            transformResponse: (data: any) => data.conversation,
            invalidatesTags: ["Conversations"],
        }),
        
        sendMessage: builder.mutation<Conversation, { conversationId: string; content: string }>({
            query: ({ conversationId, content }) => ({
                url: `/chat/${conversationId}/message`,
                method: "POST",
                body: { content },
            }),
            transformResponse: (data: any) => data.conversation || [],
            invalidatesTags: ["Conversations"],
        }),

        getConversationSummary: builder.query<ConversationSummary, string>({
            query: (conversationId) => ({
                url: `/chat/${conversationId}/summary`,
                method: "GET",
            }),
            transformResponse: (data: any) => data.summary,
            providesTags: (_result, _error, conversationId) => [
                { type: "ChatSummary", id: conversationId },
            ],
            keepUnusedDataFor: 1800,
        }),

        generateConversationSummary: builder.mutation<ConversationSummary, string>({
            query: (conversationId) => ({
                url: `/chat/${conversationId}/summary`,
                method: "POST",
            }),
            transformResponse: (data: any) => data.summary,
            invalidatesTags: (_result, _error, conversationId) => [
                { type: "ChatSummary", id: conversationId },
                "Conversations",
            ],
        }),
    }),
});

    

export const {
  useStartConversationMutation,
  useGetConversationsQuery,
  useGetConversationQuery,
  useCheckActiveConversationQuery,
  useEndConversationMutation,
  useSendMessageMutation,
    useLazyGetConversationSummaryQuery,
    useGenerateConversationSummaryMutation,
} = chatApi;

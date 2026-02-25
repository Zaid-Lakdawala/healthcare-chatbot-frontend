import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/lib/utils.ts";
import type {
  AdminStats,
  AdminStatsResponse,
  AdminUsersResponse,
  AdminConversationsResponse,
  User,
  Conversation,
} from "./types";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: baseQuery,
  tagTypes: ["AdminStats", "AdminUsers", "AdminConversations"],

  endpoints: (builder) => ({
    // Get admin dashboard statistics
    getAdminStats: builder.query<AdminStats, void>({
      query: () => ({
        url: `/admin/stats`,
        method: "GET",
      }),
      transformResponse: (response: AdminStatsResponse) => response.data,
      providesTags: ["AdminStats"],
    }),

    // Get all users (admin only)
    getAllUsers: builder.query<User[], void>({
      query: () => ({
        url: `/admin/users`,
        method: "GET",
      }),
      transformResponse: (response: AdminUsersResponse) => response.data,
      providesTags: ["AdminUsers"],
    }),

    // Get all conversations (admin only)
    getAllConversations: builder.query<Conversation[], void>({
      query: () => ({
        url: `/admin/conversations`,
        method: "GET",
      }),
      transformResponse: (response: AdminConversationsResponse) => response.data,
      providesTags: ["AdminConversations"],
    }),
  }),
});

export const {
  useGetAdminStatsQuery,
  useGetAllUsersQuery,
  useGetAllConversationsQuery,
} = adminApi;

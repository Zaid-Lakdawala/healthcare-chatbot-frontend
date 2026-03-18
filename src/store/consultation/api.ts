import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/lib/utils.ts";
import type {
  Consultation,
  ConsultationListResponse,
  ConsultationMessage,
  ConsultationMessagesResponse,
  ConsultationResponse,
} from "@/store/consultation/types.ts";

export const consultationApi = createApi({
  reducerPath: "consultationApi",
  baseQuery,
  tagTypes: ["Consultations", "ConsultationMessages", "PendingConsultations"],
  endpoints: (builder) => ({
    createConsultation: builder.mutation<Consultation, { chat_id: string; severity?: string; summary?: string }>({
      query: (body) => ({
        url: "/consultations/create",
        method: "POST",
        body,
      }),
      transformResponse: (response: ConsultationResponse) => response.consultation,
      invalidatesTags: ["Consultations", "PendingConsultations"],
    }),

    getConsultations: builder.query<Consultation[], void>({
      query: () => ({
        url: "/consultations/mine",
        method: "GET",
      }),
      transformResponse: (response: ConsultationListResponse) => response.consultations,
      providesTags: ["Consultations"],
    }),

    getPendingConsultations: builder.query<Consultation[], void>({
      query: () => ({
        url: "/consultations/pending",
        method: "GET",
      }),
      transformResponse: (response: ConsultationListResponse) => response.consultations,
      providesTags: ["PendingConsultations"],
    }),

    getAssignedConsultations: builder.query<Consultation[], void>({
      query: () => ({
        url: "/consultations/doctor/assigned",
        method: "GET",
      }),
      transformResponse: (response: ConsultationListResponse) => response.consultations,
      providesTags: ["Consultations"],
    }),

    getConsultationById: builder.query<Consultation, string>({
      query: (consultationId) => ({
        url: `/consultations/${consultationId}`,
        method: "GET",
      }),
      transformResponse: (response: ConsultationResponse) => response.consultation,
      providesTags: (_result, _error, consultationId) => [{ type: "Consultations", id: consultationId }],
    }),

    acceptConsultation: builder.mutation<Consultation, string>({
      query: (consultationId) => ({
        url: `/consultations/${consultationId}/accept`,
        method: "POST",
      }),
      transformResponse: (response: ConsultationResponse) => response.consultation,
      invalidatesTags: ["PendingConsultations", "Consultations"],
    }),

    getMessages: builder.query<ConsultationMessage[], string>({
      query: (consultationId) => ({
        url: `/consultations/${consultationId}/messages`,
        method: "GET",
      }),
      transformResponse: (response: ConsultationMessagesResponse) => response.messages,
      providesTags: (_result, _error, consultationId) => [{ type: "ConsultationMessages", id: consultationId }],
    }),

    sendMessage: builder.mutation<ConsultationMessage[], { consultationId: string; message: string }>({
      query: ({ consultationId, message }) => ({
        url: `/consultations/${consultationId}/messages`,
        method: "POST",
        body: { message },
      }),
      transformResponse: (response: ConsultationMessagesResponse) => response.messages,
      invalidatesTags: (_result, _error, { consultationId }) => [
        { type: "ConsultationMessages", id: consultationId },
        "Consultations",
      ],
    }),

    closeConsultation: builder.mutation<{ success: boolean; message: string }, string>({
      query: (consultationId) => ({
        url: `/consultations/${consultationId}/close`,
        method: "POST",
      }),
      invalidatesTags: ["Consultations", "PendingConsultations"],
    }),
  }),
});

export const {
  useCreateConsultationMutation,
  useGetConsultationsQuery,
  useGetPendingConsultationsQuery,
  useGetAssignedConsultationsQuery,
  useGetConsultationByIdQuery,
  useAcceptConsultationMutation,
  useGetMessagesQuery,
  useSendMessageMutation,
  useCloseConsultationMutation,
} = consultationApi;

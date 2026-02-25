import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/lib/utils.ts";
import type { IUploadResponse, IDocumentsResponse, IDeleteDocumentResponse } from "./types";

export const documentApi = createApi({
  reducerPath: "documentApi",
  baseQuery: baseQuery,
  tagTypes: ["Documents"],

  endpoints: (builder) => ({
    uploadDocuments: builder.mutation<IUploadResponse, File[]>({
      query: (files) => {
        const formData = new FormData();
        files.forEach((file) => {
          formData.append("documents", file);
        });
        return {
          url: `/documents/upload`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Documents"],
    }),

    getDocuments: builder.query<IDocumentsResponse, void>({
      query: () => ({
        url: `/documents`,
        method: "GET",
      }),
      providesTags: ["Documents"],
    }),

    deleteDocument: builder.mutation<IDeleteDocumentResponse, string>({
      query: (documentId) => ({
        url: `/documents/${documentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Documents"],
    }),
  }),
});

export const {
  useUploadDocumentsMutation,
  useGetDocumentsQuery,
  useDeleteDocumentMutation,
} = documentApi;

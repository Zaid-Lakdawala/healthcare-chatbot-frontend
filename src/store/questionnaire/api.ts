import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/lib/utils.ts';
import { 
  type IQuestionnaireSubmitRequest, 
  type IQuestionnaireSubmitResponse, 
  type IQuestionnaireStatusResponse 
} from './types';

export const questionnaireApi = createApi({
  reducerPath: 'questionnaireApi',
  baseQuery,
  tagTypes: ['QuestionnaireStatus'],
  endpoints: (builder) => ({
    submitQuestionnaire: builder.mutation<IQuestionnaireSubmitResponse, IQuestionnaireSubmitRequest>({
      query: (data) => ({
        url: '/users/questionnaire',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['QuestionnaireStatus'],
    }),
    getQuestionnaireStatus: builder.query<IQuestionnaireStatusResponse, void>({
      query: () => ({
        url: '/users/questionnaire/status',
        method: 'GET',
      }),
      providesTags: ['QuestionnaireStatus'],
    }),
  }),
});

export const { 
  useSubmitQuestionnaireMutation, 
  useGetQuestionnaireStatusQuery 
} = questionnaireApi;

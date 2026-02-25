import { configureStore } from '@reduxjs/toolkit'
import { userApi } from '@/store/user/api.ts';
import { questionnaireApi } from '@/store/questionnaire/api.ts';
import { chatApi } from '@/store/chat/api.ts';
import { adminApi } from '@/store/admin/api.ts';
import { documentApi } from '@/store/document/api.ts';

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [questionnaireApi.reducerPath]: questionnaireApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [documentApi.reducerPath]: documentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userApi.middleware, 
      questionnaireApi.middleware, 
      chatApi.middleware,
      adminApi.middleware,
      documentApi.middleware
    ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

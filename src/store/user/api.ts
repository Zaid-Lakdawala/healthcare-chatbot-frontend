import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/lib/utils.ts';
import { type ILoginRequest, type ILoginResponse, type IRegisterRequest, type IUser } from './types';
export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery,
    endpoints: (builder) => ({
        login: builder.mutation<ILoginResponse, ILoginRequest>({
            query: (credentials) => ({
                url: '/users/login',
                method: 'POST',
                body: credentials,
            }),
            async onQueryStarted(_credentials, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.token) {
            localStorage.setItem("token", data.token);
          }
        } catch {
          // Error handling can be added here if needed
        }
      },
        }),
        register: builder.mutation<IUser, IRegisterRequest>({
            query: (userData) => ({
                url: '/users/register',
                method: 'POST',
                body: userData,
            }),
        }),
        logout: builder.mutation<void, void>({
            queryFn: () => {
                localStorage.removeItem('token');
                return { data: undefined };
            }
        }),
    }),
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation } = userApi;
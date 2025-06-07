import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  ILoginRequest,
  IAuthResponse,
  IRegisterRequest,
  IRefreshRequest,
} from "../../models/auth";
import { BASE_URL } from "../../helpers/config";

const authAPI = createApi({
  reducerPath: "authAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL + "auth/",
  }),
  endpoints: (build) => ({
    register: build.mutation<IAuthResponse, IRegisterRequest>({
      query: (user) => ({
        url: "register/",
        method: "POST",
        body: user,
      }),
    }),
    login: build.mutation<IAuthResponse, ILoginRequest>({
      query: (user) => ({
        url: "login/",
        method: "POST",
        body: user,
      }),
    }),
    logout: build.mutation<void, IRefreshRequest>({
      query: (user) => ({
        url: "log-out/",
        method: "POST",
        body: user,
      }),
    }),
    refresh: build.mutation<IAuthResponse, IRefreshRequest>({
      query: (user) => ({
        url: "refresh/",
        method: "POST",
        body: user,
      }),
    }),
  }),
});

export default authAPI;
export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useRefreshMutation,
} = authAPI;

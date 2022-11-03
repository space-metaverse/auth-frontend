import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface AuthError {
  data: {
    message?: string
    code?: string
    time?: string
    requestId?: string
    statusCode?: number
    retryable?: boolean
    retryDelay?: number
  }
  status: number
}

interface AuthenticationResult {
  AccessToken: string
  ExpiresIn: number
  TokenType: string
  RefreshToken: string
  IdToken: string
}

interface LoginRequest {
  username: string
  password: string
}

interface LoginResponse {
  ChallengeParameters?: Record<any, any>
  AuthenticationResult?: AuthenticationResult
  username?: string
  groups?: string[]
  loginCode?: string
}

interface CodeDeliveryDetails {
  Destination: string
  DeliveryMedium: string
  AttributeName: string
}

interface SignupRequest {
  username: string
  email: string
  password: string
  phone?: string
}

interface SignupResponse {
  UserConfirmed?: boolean
  CodeDeliveryDetails?: CodeDeliveryDetails
  UserSub?: string
}

interface VerifyCodeRequest {
  loginCode: string
}

interface VerifyCodeResponse {
  username: string
  token: string
}

// https://api.dev.tryspace.com/auth
// http://localhost:3000/auth

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3002/auth' }),
  endpoints: (builder) => ({
    postLogin: builder.mutation<LoginResponse, LoginRequest>({
      query: ({ username, password }) => ({
        url: '/login',
        method: 'POST',
        body: {
          username,
          password
        }
      })
    }),
    postSignup: builder.mutation<SignupResponse, SignupRequest>({
      query: ({ username, email, password, phone = '' }) => ({
        url: '/signup',
        method: 'POST',
        body: {
          username,
          email,
          password,
          phone
        }
      })
    }),
    postVerifyCode: builder.mutation<VerifyCodeResponse, VerifyCodeRequest>({
      query: ({ loginCode }) => ({
        url: '/verifyCode',
        method: 'POST',
        body: {
          loginCode
        }
      })
    })
  })
})

export const {
  usePostLoginMutation,
  usePostSignupMutation,
  usePostVerifyCodeMutation
} = authApi

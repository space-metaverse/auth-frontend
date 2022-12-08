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

export interface LoginResponse {
  accountId: string
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
  email: string
  phone?: string
  username: string
  password: string
  segmentAliasId: number | string
  receiveMarketingEmails?: boolean
}

export interface SignupResponse {
  accountId: string
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

interface ForgotPasswordRequest {
  email: string
}

interface ForgotPasswordResponse {
  message: string
}

const getBaseURL = () => {
  switch (process.env.NEXT_PUBLIC_ENV) {
    case 'local':
      return 'http://localhost:3002/auth'
    case 'dev':
      return 'https://api.dev.tryspace.com/auth'
    case 'qa':
      return 'https://api.qa.tryspace.com/auth'
    case 'prod':
      return 'https://api.tryspace.com/auth'
    default:
      console.log('No ENV set')
      return 'https://api.dev.tryspace.com/auth'
  }
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: getBaseURL() }),
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
      query: ({ username, email, password, segmentAliasId, receiveMarketingEmails, phone = '' }) => ({
        url: '/signup',
        method: 'POST',
        body: {
          phone,
          email,
          username,
          password,
          segmentAliasId,
          receiveMarketingEmails,
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
    }),
    postForgotPassword: builder.mutation<ForgotPasswordResponse, ForgotPasswordRequest>({
      query: ({ email }) => ({
        url: '/forgotPassword',
        method: 'POST',
        body: {
          email
        }
      })
    })
  })
})

export const {
  usePostLoginMutation,
  usePostSignupMutation,
  usePostVerifyCodeMutation,
  usePostForgotPasswordMutation
} = authApi

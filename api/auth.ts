import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export interface AuthError {
    data: {
        message?: string;
        code?: string;
        time?: string;
        requestId?: string;
        statusCode?: number;
        retryable?: boolean;
        retryDelay?: number;
    }
    status: number;
}

interface AuthenticationResult {
    AccessToken: string;
    ExpiresIn: number;
    TokenType: string;
    RefreshToken: string;
    IdToken: string;
}

interface LoginRequest {
    username: string;
    password: string;
}

interface LoginResponse {
    ChallengeParameters?: Record<any, any>;
    AuthenticationResult?: AuthenticationResult;
    username?: string;
    groups?: string[];
}

interface CodeDeliveryDetails {
    Destination: string;
    DeliveryMedium: string;
    AttributeName: string;
}

interface SignupRequest {
    username: string;
    email: string;
    password: string;
    phone?: string;
}

interface SignupResponse {
    UserConfirmed?: boolean;
    CodeDeliveryDetails?: CodeDeliveryDetails;
    UserSub?: string;
}

interface ConfirmSignupRequest {
    username: string;
    otp: string;
}

interface ConfirmSignupResponse {
    UserConfirmed: boolean;
    CodeDeliveryDetails: CodeDeliveryDetails;
    UserSub: string;
}

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({ baseUrl: 'https://api.dev.tryspace.com/auth' }),
    endpoints: (builder) => ({
        postLogin: builder.mutation<LoginResponse, LoginRequest>({
            query: ({ username, password }) => ({
                url: "/login",
                method: "POST",
                body: {
                    username,
                    password,
                }
            })
        }),
        postSignup: builder.mutation<SignupResponse, SignupRequest>({
            query: ({ username, email, password, phone = '' }) => ({
                url: "/signup",
                method: "POST",
                body: {
                    username,
                    email,
                    password,
                    phone
                }
            }),
        }),
        postConfirmSignup: builder.mutation<ConfirmSignupResponse, ConfirmSignupRequest>({
            query: ({ username, otp }) => ({
                url: "/confirmSignUp",
                method: "POST",
                body: {
                    username,
                    otp,
                }
            })
        })
    })
});

export const {
    usePostLoginMutation,
    usePostSignupMutation,
    usePostConfirmSignupMutation
} = authApi;
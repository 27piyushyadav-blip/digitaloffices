import { z } from 'zod';
/**
 * Shared primitives
 */
export declare const AuthProviderSchema: z.ZodEnum<{
    credentials: "credentials";
    google: "google";
}>;
export type AuthProvider = z.infer<typeof AuthProviderSchema>;
export declare const AuthUserSchema: z.ZodObject<{
    id: z.ZodString;
    username: z.ZodString;
    email: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    emailVerified: z.ZodBoolean;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strip>;
export type AuthUser = z.infer<typeof AuthUserSchema>;
export declare const AuthTokensSchema: z.ZodObject<{
    accessToken: z.ZodString;
    refreshToken: z.ZodString;
    accessTokenExpiresIn: z.ZodNumber;
    refreshTokenExpiresIn: z.ZodOptional<z.ZodNumber>;
    tokenType: z.ZodDefault<z.ZodLiteral<"Bearer">>;
}, z.core.$strip>;
export type AuthTokens = z.infer<typeof AuthTokensSchema>;
export declare const AuthSessionSchema: z.ZodObject<{
    user: z.ZodObject<{
        id: z.ZodString;
        username: z.ZodString;
        email: z.ZodString;
        firstName: z.ZodString;
        lastName: z.ZodString;
        emailVerified: z.ZodBoolean;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, z.core.$strip>;
    tokens: z.ZodObject<{
        accessToken: z.ZodString;
        refreshToken: z.ZodString;
        accessTokenExpiresIn: z.ZodNumber;
        refreshTokenExpiresIn: z.ZodOptional<z.ZodNumber>;
        tokenType: z.ZodDefault<z.ZodLiteral<"Bearer">>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type AuthSession = z.infer<typeof AuthSessionSchema>;
/**
 * AuthSession is returned by endpoints that create or rotate an authenticated session:
 * - Login (credentials)
 * - Google OAuth callback
 * - Token refresh
 * - Email verification (auto-login)
 *
 * Register does NOT return AuthSession (only creates user and triggers email verification).
 */
/**
 * Error contracts
 */
export declare const AuthErrorCodeSchema: z.ZodEnum<{
    INVALID_CREDENTIALS: "INVALID_CREDENTIALS";
    EMAIL_ALREADY_IN_USE: "EMAIL_ALREADY_IN_USE";
    EMAIL_NOT_VERIFIED: "EMAIL_NOT_VERIFIED";
    INVALID_OR_EXPIRED_TOKEN: "INVALID_OR_EXPIRED_TOKEN";
    OAUTH_ERROR: "OAUTH_ERROR";
    UNAUTHENTICATED: "UNAUTHENTICATED";
    UNAUTHORIZED: "UNAUTHORIZED";
    UNKNOWN: "UNKNOWN";
}>;
export type AuthErrorCode = z.infer<typeof AuthErrorCodeSchema>;
export declare const AuthErrorSchema: z.ZodObject<{
    code: z.ZodEnum<{
        INVALID_CREDENTIALS: "INVALID_CREDENTIALS";
        EMAIL_ALREADY_IN_USE: "EMAIL_ALREADY_IN_USE";
        EMAIL_NOT_VERIFIED: "EMAIL_NOT_VERIFIED";
        INVALID_OR_EXPIRED_TOKEN: "INVALID_OR_EXPIRED_TOKEN";
        OAUTH_ERROR: "OAUTH_ERROR";
        UNAUTHENTICATED: "UNAUTHENTICATED";
        UNAUTHORIZED: "UNAUTHORIZED";
        UNKNOWN: "UNKNOWN";
    }>;
    message: z.ZodString;
    details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
export type AuthError = z.infer<typeof AuthErrorSchema>;
/**
 * Register
 *
 * Username is NOT sent by the frontend. The backend generates a unique username
 * and returns it in the registration response.
 */
export declare const RegisterRequestSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
}, z.core.$strip>;
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export declare const RegisterResponseSchema: z.ZodObject<{
    success: z.ZodLiteral<true>;
    username: z.ZodString;
    message: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type RegisterResponse = z.infer<typeof RegisterResponseSchema>;
/**
 * Login with credentials
 */
export declare const LoginCredentialsRequestSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    rememberMe: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type LoginCredentialsRequest = z.infer<typeof LoginCredentialsRequestSchema>;
export declare const LoginCredentialsResponseSchema: z.ZodObject<{
    user: z.ZodObject<{
        id: z.ZodString;
        username: z.ZodString;
        email: z.ZodString;
        firstName: z.ZodString;
        lastName: z.ZodString;
        emailVerified: z.ZodBoolean;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, z.core.$strip>;
    tokens: z.ZodObject<{
        accessToken: z.ZodString;
        refreshToken: z.ZodString;
        accessTokenExpiresIn: z.ZodNumber;
        refreshTokenExpiresIn: z.ZodOptional<z.ZodNumber>;
        tokenType: z.ZodDefault<z.ZodLiteral<"Bearer">>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type LoginCredentialsResponse = z.infer<typeof LoginCredentialsResponseSchema>;
/**
 * Google OAuth
 *
 * Assumption: frontend obtains a Google ID token and posts it to the backend.
 */
export declare const GoogleOAuthRequestSchema: z.ZodObject<{
    idToken: z.ZodString;
}, z.core.$strip>;
export type GoogleOAuthRequest = z.infer<typeof GoogleOAuthRequestSchema>;
export declare const GoogleOAuthResponseSchema: z.ZodObject<{
    user: z.ZodObject<{
        id: z.ZodString;
        username: z.ZodString;
        email: z.ZodString;
        firstName: z.ZodString;
        lastName: z.ZodString;
        emailVerified: z.ZodBoolean;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, z.core.$strip>;
    tokens: z.ZodObject<{
        accessToken: z.ZodString;
        refreshToken: z.ZodString;
        accessTokenExpiresIn: z.ZodNumber;
        refreshTokenExpiresIn: z.ZodOptional<z.ZodNumber>;
        tokenType: z.ZodDefault<z.ZodLiteral<"Bearer">>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type GoogleOAuthResponse = z.infer<typeof GoogleOAuthResponseSchema>;
/**
 * Email verification
 */
export declare const RequestEmailVerificationSchema: z.ZodObject<{}, z.core.$strip>;
export type RequestEmailVerification = z.infer<typeof RequestEmailVerificationSchema>;
export declare const RequestEmailVerificationResponseSchema: z.ZodObject<{
    success: z.ZodLiteral<true>;
}, z.core.$strip>;
export type RequestEmailVerificationResponse = z.infer<typeof RequestEmailVerificationResponseSchema>;
export declare const VerifyEmailRequestSchema: z.ZodObject<{
    token: z.ZodString;
}, z.core.$strip>;
export type VerifyEmailRequest = z.infer<typeof VerifyEmailRequestSchema>;
export declare const VerifyEmailResponseSchema: z.ZodObject<{
    user: z.ZodObject<{
        id: z.ZodString;
        username: z.ZodString;
        email: z.ZodString;
        firstName: z.ZodString;
        lastName: z.ZodString;
        emailVerified: z.ZodBoolean;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, z.core.$strip>;
    tokens: z.ZodObject<{
        accessToken: z.ZodString;
        refreshToken: z.ZodString;
        accessTokenExpiresIn: z.ZodNumber;
        refreshTokenExpiresIn: z.ZodOptional<z.ZodNumber>;
        tokenType: z.ZodDefault<z.ZodLiteral<"Bearer">>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type VerifyEmailResponse = z.infer<typeof VerifyEmailResponseSchema>;
/**
 * Token / session helpers
 */
export declare const RefreshTokenRequestSchema: z.ZodObject<{
    refreshToken: z.ZodString;
}, z.core.$strip>;
export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequestSchema>;
export declare const RefreshTokenResponseSchema: z.ZodObject<{
    user: z.ZodObject<{
        id: z.ZodString;
        username: z.ZodString;
        email: z.ZodString;
        firstName: z.ZodString;
        lastName: z.ZodString;
        emailVerified: z.ZodBoolean;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, z.core.$strip>;
    tokens: z.ZodObject<{
        accessToken: z.ZodString;
        refreshToken: z.ZodString;
        accessTokenExpiresIn: z.ZodNumber;
        refreshTokenExpiresIn: z.ZodOptional<z.ZodNumber>;
        tokenType: z.ZodDefault<z.ZodLiteral<"Bearer">>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type RefreshTokenResponse = z.infer<typeof RefreshTokenResponseSchema>;

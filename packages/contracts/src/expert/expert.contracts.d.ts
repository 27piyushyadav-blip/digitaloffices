import { z } from 'zod';
/**
 * Expert role and verification contracts
 */
export declare const UserRoleSchema: z.ZodEnum<{
    USER: "USER";
    EXPERT: "EXPERT";
    ADMIN: "ADMIN";
}>;
export type UserRole = z.infer<typeof UserRoleSchema>;
export declare const VerificationStatusSchema: z.ZodEnum<{
    PENDING: "PENDING";
    VERIFIED: "VERIFIED";
    REJECTED: "REJECTED";
}>;
export type VerificationStatus = z.infer<typeof VerificationStatusSchema>;
export declare const ExpertProfileSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    verificationStatus: z.ZodEnum<{
        PENDING: "PENDING";
        VERIFIED: "VERIFIED";
        REJECTED: "REJECTED";
    }>;
    rejectionReasons: z.ZodDefault<z.ZodArray<z.ZodString>>;
    verifiedAt: z.ZodOptional<z.ZodString>;
    verifiedBy: z.ZodOptional<z.ZodString>;
    specialization: z.ZodOptional<z.ZodString>;
    experience: z.ZodOptional<z.ZodString>;
    qualifications: z.ZodOptional<z.ZodString>;
    bio: z.ZodOptional<z.ZodString>;
    website: z.ZodOptional<z.ZodString>;
    linkedin: z.ZodOptional<z.ZodString>;
    portfolio: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strip>;
export type ExpertProfile = z.infer<typeof ExpertProfileSchema>;
export declare const ExpertUserSchema: z.ZodObject<{
    id: z.ZodString;
    username: z.ZodString;
    email: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    emailVerified: z.ZodBoolean;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    role: z.ZodEnum<{
        USER: "USER";
        EXPERT: "EXPERT";
        ADMIN: "ADMIN";
    }>;
    isBlocked: z.ZodBoolean;
    isUnlisted: z.ZodBoolean;
}, z.core.$strip>;
export type ExpertUser = z.infer<typeof ExpertUserSchema>;
export declare const ExpertWithProfileSchema: z.ZodObject<{
    id: z.ZodString;
    username: z.ZodString;
    email: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    emailVerified: z.ZodBoolean;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    role: z.ZodEnum<{
        USER: "USER";
        EXPERT: "EXPERT";
        ADMIN: "ADMIN";
    }>;
    isBlocked: z.ZodBoolean;
    isUnlisted: z.ZodBoolean;
    expertProfile: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        userId: z.ZodString;
        verificationStatus: z.ZodEnum<{
            PENDING: "PENDING";
            VERIFIED: "VERIFIED";
            REJECTED: "REJECTED";
        }>;
        rejectionReasons: z.ZodDefault<z.ZodArray<z.ZodString>>;
        verifiedAt: z.ZodOptional<z.ZodString>;
        verifiedBy: z.ZodOptional<z.ZodString>;
        specialization: z.ZodOptional<z.ZodString>;
        experience: z.ZodOptional<z.ZodString>;
        qualifications: z.ZodOptional<z.ZodString>;
        bio: z.ZodOptional<z.ZodString>;
        website: z.ZodOptional<z.ZodString>;
        linkedin: z.ZodOptional<z.ZodString>;
        portfolio: z.ZodOptional<z.ZodString>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type ExpertWithProfile = z.infer<typeof ExpertWithProfileSchema>;
/**
 * Expert Registration
 */
export declare const ExpertRegisterRequestSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    specialization: z.ZodOptional<z.ZodString>;
    experience: z.ZodOptional<z.ZodString>;
    qualifications: z.ZodOptional<z.ZodString>;
    bio: z.ZodOptional<z.ZodString>;
    website: z.ZodOptional<z.ZodString>;
    linkedin: z.ZodOptional<z.ZodString>;
    portfolio: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type ExpertRegisterRequest = z.infer<typeof ExpertRegisterRequestSchema>;
export declare const ExpertRegisterResponseSchema: z.ZodObject<{
    success: z.ZodLiteral<true>;
    username: z.ZodString;
    message: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type ExpertRegisterResponse = z.infer<typeof ExpertRegisterResponseSchema>;
/**
 * Expert Login (same as regular user login but with role validation)
 */
export declare const ExpertLoginRequestSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    rememberMe: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type ExpertLoginRequest = z.infer<typeof ExpertLoginRequestSchema>;
export declare const ExpertLoginResponseSchema: z.ZodObject<{
    user: z.ZodObject<{
        id: z.ZodString;
        username: z.ZodString;
        email: z.ZodString;
        firstName: z.ZodString;
        lastName: z.ZodString;
        emailVerified: z.ZodBoolean;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        role: z.ZodEnum<{
            USER: "USER";
            EXPERT: "EXPERT";
            ADMIN: "ADMIN";
        }>;
        isBlocked: z.ZodBoolean;
        isUnlisted: z.ZodBoolean;
    }, z.core.$strip>;
    tokens: z.ZodObject<{
        accessToken: z.ZodString;
        refreshToken: z.ZodString;
        accessTokenExpiresIn: z.ZodNumber;
        refreshTokenExpiresIn: z.ZodOptional<z.ZodNumber>;
        tokenType: z.ZodDefault<z.ZodLiteral<"Bearer">>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type ExpertLoginResponse = z.infer<typeof ExpertLoginResponseSchema>;
/**
 * Expert Profile Management
 */
export declare const UpdateExpertProfileRequestSchema: z.ZodObject<{
    specialization: z.ZodOptional<z.ZodString>;
    experience: z.ZodOptional<z.ZodString>;
    qualifications: z.ZodOptional<z.ZodString>;
    bio: z.ZodOptional<z.ZodString>;
    website: z.ZodOptional<z.ZodString>;
    linkedin: z.ZodOptional<z.ZodString>;
    portfolio: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type UpdateExpertProfileRequest = z.infer<typeof UpdateExpertProfileRequestSchema>;
export declare const UpdateExpertProfileResponseSchema: z.ZodObject<{
    success: z.ZodLiteral<true>;
    message: z.ZodString;
    pendingChanges: z.ZodBoolean;
}, z.core.$strip>;
export type UpdateExpertProfileResponse = z.infer<typeof UpdateExpertProfileResponseSchema>;
/**
 * Public Expert Response (only verified experts)
 */
export declare const PublicExpertResponseSchema: z.ZodObject<{
    user: z.ZodObject<{
        id: z.ZodString;
        username: z.ZodString;
        firstName: z.ZodString;
        lastName: z.ZodString;
    }, z.core.$strip>;
    expertProfile: z.ZodObject<{
        specialization: z.ZodOptional<z.ZodString>;
        experience: z.ZodOptional<z.ZodString>;
        qualifications: z.ZodOptional<z.ZodString>;
        bio: z.ZodOptional<z.ZodString>;
        website: z.ZodOptional<z.ZodString>;
        linkedin: z.ZodOptional<z.ZodString>;
        portfolio: z.ZodOptional<z.ZodString>;
        verifiedAt: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export type PublicExpertResponse = z.infer<typeof PublicExpertResponseSchema>;
/**
 * Expert Error Codes
 */
export declare const ExpertErrorCodeSchema: z.ZodEnum<{
    INVALID_CREDENTIALS: "INVALID_CREDENTIALS";
    EMAIL_ALREADY_IN_USE: "EMAIL_ALREADY_IN_USE";
    EMAIL_NOT_VERIFIED: "EMAIL_NOT_VERIFIED";
    INVALID_OR_EXPIRED_TOKEN: "INVALID_OR_EXPIRED_TOKEN";
    OAUTH_ERROR: "OAUTH_ERROR";
    UNAUTHENTICATED: "UNAUTHENTICATED";
    UNAUTHORIZED: "UNAUTHORIZED";
    UNKNOWN: "UNKNOWN";
    EXPERT_NOT_FOUND: "EXPERT_NOT_FOUND";
    EXPERT_NOT_VERIFIED: "EXPERT_NOT_VERIFIED";
    EXPERT_BLOCKED: "EXPERT_BLOCKED";
    EXPERT_UNLISTED: "EXPERT_UNLISTED";
    PROFILE_UPDATE_PENDING: "PROFILE_UPDATE_PENDING";
    INVALID_EXPERT_DATA: "INVALID_EXPERT_DATA";
}>;
export type ExpertErrorCode = z.infer<typeof ExpertErrorCodeSchema>;
export declare const ExpertErrorSchema: z.ZodObject<{
    message: z.ZodString;
    details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    code: z.ZodEnum<{
        INVALID_CREDENTIALS: "INVALID_CREDENTIALS";
        EMAIL_ALREADY_IN_USE: "EMAIL_ALREADY_IN_USE";
        EMAIL_NOT_VERIFIED: "EMAIL_NOT_VERIFIED";
        INVALID_OR_EXPIRED_TOKEN: "INVALID_OR_EXPIRED_TOKEN";
        OAUTH_ERROR: "OAUTH_ERROR";
        UNAUTHENTICATED: "UNAUTHENTICATED";
        UNAUTHORIZED: "UNAUTHORIZED";
        UNKNOWN: "UNKNOWN";
        EXPERT_NOT_FOUND: "EXPERT_NOT_FOUND";
        EXPERT_NOT_VERIFIED: "EXPERT_NOT_VERIFIED";
        EXPERT_BLOCKED: "EXPERT_BLOCKED";
        EXPERT_UNLISTED: "EXPERT_UNLISTED";
        PROFILE_UPDATE_PENDING: "PROFILE_UPDATE_PENDING";
        INVALID_EXPERT_DATA: "INVALID_EXPERT_DATA";
    }>;
}, z.core.$strip>;
export type ExpertError = z.infer<typeof ExpertErrorSchema>;

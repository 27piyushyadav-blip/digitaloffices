import { z } from 'zod';
/**
 * Admin Authentication
 */
export declare const AdminLoginRequestSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    rememberMe: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type AdminLoginRequest = z.infer<typeof AdminLoginRequestSchema>;
export declare const AdminLoginResponseSchema: z.ZodObject<{
    user: z.ZodObject<{
        id: z.ZodString;
        username: z.ZodString;
        email: z.ZodString;
        firstName: z.ZodString;
        lastName: z.ZodString;
        emailVerified: z.ZodBoolean;
        role: z.ZodLiteral<"ADMIN">;
        isBlocked: z.ZodBoolean;
        isUnlisted: z.ZodBoolean;
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
export type AdminLoginResponse = z.infer<typeof AdminLoginResponseSchema>;
/**
 * Admin Control Actions
 */
export declare const BlockUserRequestSchema: z.ZodObject<{
    userId: z.ZodString;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type BlockUserRequest = z.infer<typeof BlockUserRequestSchema>;
export declare const BlockUserResponseSchema: z.ZodObject<{
    success: z.ZodLiteral<true>;
    message: z.ZodString;
}, z.core.$strip>;
export type BlockUserResponse = z.infer<typeof BlockUserResponseSchema>;
export declare const UnblockUserRequestSchema: z.ZodObject<{
    userId: z.ZodString;
}, z.core.$strip>;
export type UnblockUserRequest = z.infer<typeof UnblockUserRequestSchema>;
export declare const UnblockUserResponseSchema: z.ZodObject<{
    success: z.ZodLiteral<true>;
    message: z.ZodString;
}, z.core.$strip>;
export type UnblockUserResponse = z.infer<typeof UnblockUserResponseSchema>;
export declare const UnlistUserRequestSchema: z.ZodObject<{
    userId: z.ZodString;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type UnlistUserRequest = z.infer<typeof UnlistUserRequestSchema>;
export declare const UnlistUserResponseSchema: z.ZodObject<{
    success: z.ZodLiteral<true>;
    message: z.ZodString;
}, z.core.$strip>;
export type UnlistUserResponse = z.infer<typeof UnlistUserResponseSchema>;
export declare const ListUserRequestSchema: z.ZodObject<{
    userId: z.ZodString;
}, z.core.$strip>;
export type ListUserRequest = z.infer<typeof ListUserRequestSchema>;
export declare const ListUserResponseSchema: z.ZodObject<{
    success: z.ZodLiteral<true>;
    message: z.ZodString;
}, z.core.$strip>;
export type ListUserResponse = z.infer<typeof ListUserResponseSchema>;
/**
 * Expert Verification Management
 */
export declare const GetPendingExpertsResponseSchema: z.ZodObject<{
    experts: z.ZodArray<z.ZodObject<{
        user: z.ZodObject<{
            id: z.ZodString;
            username: z.ZodString;
            email: z.ZodString;
            firstName: z.ZodString;
            lastName: z.ZodString;
            createdAt: z.ZodString;
        }, z.core.$strip>;
        expertProfile: z.ZodObject<{
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
    }, z.core.$strip>>;
    total: z.ZodNumber;
}, z.core.$strip>;
export type GetPendingExpertsResponse = z.infer<typeof GetPendingExpertsResponseSchema>;
export declare const ApproveExpertRequestSchema: z.ZodObject<{
    expertId: z.ZodString;
}, z.core.$strip>;
export type ApproveExpertRequest = z.infer<typeof ApproveExpertRequestSchema>;
export declare const ApproveExpertResponseSchema: z.ZodObject<{
    success: z.ZodLiteral<true>;
    message: z.ZodString;
    expertProfile: z.ZodObject<{
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
}, z.core.$strip>;
export type ApproveExpertResponse = z.infer<typeof ApproveExpertResponseSchema>;
export declare const RejectExpertRequestSchema: z.ZodObject<{
    expertId: z.ZodString;
    rejectionReasons: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export type RejectExpertRequest = z.infer<typeof RejectExpertRequestSchema>;
export declare const RejectExpertResponseSchema: z.ZodObject<{
    success: z.ZodLiteral<true>;
    message: z.ZodString;
    expertProfile: z.ZodObject<{
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
}, z.core.$strip>;
export type RejectExpertResponse = z.infer<typeof RejectExpertResponseSchema>;
export declare const GetExpertChangesRequestSchema: z.ZodObject<{
    expertId: z.ZodString;
}, z.core.$strip>;
export type GetExpertChangesRequest = z.infer<typeof GetExpertChangesRequestSchema>;
export declare const GetExpertChangesResponseSchema: z.ZodObject<{
    expert: z.ZodObject<{
        user: z.ZodObject<{
            id: z.ZodString;
            username: z.ZodString;
            email: z.ZodString;
            firstName: z.ZodString;
            lastName: z.ZodString;
        }, z.core.$strip>;
        expertProfile: z.ZodObject<{
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
    }, z.core.$strip>;
    pendingChanges: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
export type GetExpertChangesResponse = z.infer<typeof GetExpertChangesResponseSchema>;
export declare const ApproveExpertChangesRequestSchema: z.ZodObject<{
    expertId: z.ZodString;
}, z.core.$strip>;
export type ApproveExpertChangesRequest = z.infer<typeof ApproveExpertChangesRequestSchema>;
export declare const ApproveExpertChangesResponseSchema: z.ZodObject<{
    success: z.ZodLiteral<true>;
    message: z.ZodString;
    expertProfile: z.ZodObject<{
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
}, z.core.$strip>;
export type ApproveExpertChangesResponse = z.infer<typeof ApproveExpertChangesResponseSchema>;
export declare const RejectExpertChangesRequestSchema: z.ZodObject<{
    expertId: z.ZodString;
    rejectionReasons: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export type RejectExpertChangesRequest = z.infer<typeof RejectExpertChangesRequestSchema>;
export declare const RejectExpertChangesResponseSchema: z.ZodObject<{
    success: z.ZodLiteral<true>;
    message: z.ZodString;
    expertProfile: z.ZodObject<{
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
}, z.core.$strip>;
export type RejectExpertChangesResponse = z.infer<typeof RejectExpertChangesResponseSchema>;
/**
 * Admin Dashboard Data
 */
export declare const AdminDashboardResponseSchema: z.ZodObject<{
    stats: z.ZodObject<{
        totalUsers: z.ZodNumber;
        totalExperts: z.ZodNumber;
        verifiedExperts: z.ZodNumber;
        pendingExperts: z.ZodNumber;
        blockedUsers: z.ZodNumber;
        unlistedUsers: z.ZodNumber;
    }, z.core.$strip>;
    recentActivity: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodString;
        description: z.ZodString;
        timestamp: z.ZodString;
        userId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type AdminDashboardResponse = z.infer<typeof AdminDashboardResponseSchema>;
/**
 * Admin Error Codes
 */
export declare const AdminErrorCodeSchema: z.ZodEnum<{
    INVALID_CREDENTIALS: "INVALID_CREDENTIALS";
    EMAIL_ALREADY_IN_USE: "EMAIL_ALREADY_IN_USE";
    EMAIL_NOT_VERIFIED: "EMAIL_NOT_VERIFIED";
    INVALID_OR_EXPIRED_TOKEN: "INVALID_OR_EXPIRED_TOKEN";
    OAUTH_ERROR: "OAUTH_ERROR";
    UNAUTHENTICATED: "UNAUTHENTICATED";
    UNAUTHORIZED: "UNAUTHORIZED";
    UNKNOWN: "UNKNOWN";
    EXPERT_NOT_FOUND: "EXPERT_NOT_FOUND";
    ADMIN_ACCESS_REQUIRED: "ADMIN_ACCESS_REQUIRED";
    USER_NOT_FOUND: "USER_NOT_FOUND";
    EXPERT_ALREADY_VERIFIED: "EXPERT_ALREADY_VERIFIED";
    EXPERT_NOT_PENDING: "EXPERT_NOT_PENDING";
    INVALID_ADMIN_ACTION: "INVALID_ADMIN_ACTION";
    INSUFFICIENT_PERMISSIONS: "INSUFFICIENT_PERMISSIONS";
}>;
export type AdminErrorCode = z.infer<typeof AdminErrorCodeSchema>;
export declare const AdminErrorSchema: z.ZodObject<{
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
        ADMIN_ACCESS_REQUIRED: "ADMIN_ACCESS_REQUIRED";
        USER_NOT_FOUND: "USER_NOT_FOUND";
        EXPERT_ALREADY_VERIFIED: "EXPERT_ALREADY_VERIFIED";
        EXPERT_NOT_PENDING: "EXPERT_NOT_PENDING";
        INVALID_ADMIN_ACTION: "INVALID_ADMIN_ACTION";
        INSUFFICIENT_PERMISSIONS: "INSUFFICIENT_PERMISSIONS";
    }>;
}, z.core.$strip>;
export type AdminError = z.infer<typeof AdminErrorSchema>;

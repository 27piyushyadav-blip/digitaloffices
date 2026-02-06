"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminErrorSchema = exports.AdminErrorCodeSchema = exports.AdminDashboardResponseSchema = exports.RejectExpertChangesResponseSchema = exports.RejectExpertChangesRequestSchema = exports.ApproveExpertChangesResponseSchema = exports.ApproveExpertChangesRequestSchema = exports.GetExpertChangesResponseSchema = exports.GetExpertChangesRequestSchema = exports.RejectExpertResponseSchema = exports.RejectExpertRequestSchema = exports.ApproveExpertResponseSchema = exports.ApproveExpertRequestSchema = exports.GetPendingExpertsResponseSchema = exports.ListUserResponseSchema = exports.ListUserRequestSchema = exports.UnlistUserResponseSchema = exports.UnlistUserRequestSchema = exports.UnblockUserResponseSchema = exports.UnblockUserRequestSchema = exports.BlockUserResponseSchema = exports.BlockUserRequestSchema = exports.AdminLoginResponseSchema = exports.AdminLoginRequestSchema = void 0;
const zod_1 = require("zod");
const __1 = require("..");
const auth_contracts_1 = require("../auth/auth.contracts");
const expert_contracts_1 = require("../expert/expert.contracts");
/**
 * Admin Authentication
 */
exports.AdminLoginRequestSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
    rememberMe: zod_1.z.boolean().optional(),
});
exports.AdminLoginResponseSchema = zod_1.z.object({
    user: zod_1.z.object({
        id: zod_1.z.string(),
        username: zod_1.z.string(),
        email: zod_1.z.string(),
        firstName: zod_1.z.string(),
        lastName: zod_1.z.string(),
        emailVerified: zod_1.z.boolean(),
        role: zod_1.z.literal('ADMIN'),
        isBlocked: zod_1.z.boolean(),
        isUnlisted: zod_1.z.boolean(),
        createdAt: zod_1.z.string().datetime(),
        updatedAt: zod_1.z.string().datetime(),
    }),
    tokens: zod_1.z.object({
        accessToken: zod_1.z.string(),
        refreshToken: zod_1.z.string(),
        accessTokenExpiresIn: zod_1.z.number().int().positive(),
        refreshTokenExpiresIn: zod_1.z.number().int().positive().optional(),
        tokenType: zod_1.z.literal('Bearer').default('Bearer'),
    }),
});
/**
 * Admin Control Actions
 */
exports.BlockUserRequestSchema = zod_1.z.object({
    userId: zod_1.z.string(),
    reason: zod_1.z.string().optional(),
});
exports.BlockUserResponseSchema = zod_1.z.object({
    success: zod_1.z.literal(true),
    message: zod_1.z.string(),
});
exports.UnblockUserRequestSchema = zod_1.z.object({
    userId: zod_1.z.string(),
});
exports.UnblockUserResponseSchema = zod_1.z.object({
    success: zod_1.z.literal(true),
    message: zod_1.z.string(),
});
exports.UnlistUserRequestSchema = zod_1.z.object({
    userId: zod_1.z.string(),
    reason: zod_1.z.string().optional(),
});
exports.UnlistUserResponseSchema = zod_1.z.object({
    success: zod_1.z.literal(true),
    message: zod_1.z.string(),
});
exports.ListUserRequestSchema = zod_1.z.object({
    userId: zod_1.z.string(),
});
exports.ListUserResponseSchema = zod_1.z.object({
    success: zod_1.z.literal(true),
    message: zod_1.z.string(),
});
/**
 * Expert Verification Management
 */
exports.GetPendingExpertsResponseSchema = zod_1.z.object({
    experts: zod_1.z.array(zod_1.z.object({
        user: zod_1.z.object({
            id: zod_1.z.string(),
            username: zod_1.z.string(),
            email: zod_1.z.string(),
            firstName: zod_1.z.string(),
            lastName: zod_1.z.string(),
            createdAt: zod_1.z.string().datetime(),
        }),
        expertProfile: expert_contracts_1.ExpertProfileSchema,
    })),
    total: zod_1.z.number(),
});
exports.ApproveExpertRequestSchema = zod_1.z.object({
    expertId: zod_1.z.string(),
});
exports.ApproveExpertResponseSchema = zod_1.z.object({
    success: zod_1.z.literal(true),
    message: zod_1.z.string(),
    expertProfile: expert_contracts_1.ExpertProfileSchema,
});
exports.RejectExpertRequestSchema = zod_1.z.object({
    expertId: zod_1.z.string(),
    rejectionReasons: zod_1.z.string().array(),
});
exports.RejectExpertResponseSchema = zod_1.z.object({
    success: zod_1.z.literal(true),
    message: zod_1.z.string(),
    expertProfile: expert_contracts_1.ExpertProfileSchema,
});
exports.GetExpertChangesRequestSchema = zod_1.z.object({
    expertId: zod_1.z.string(),
});
exports.GetExpertChangesResponseSchema = zod_1.z.object({
    expert: zod_1.z.object({
        user: zod_1.z.object({
            id: zod_1.z.string(),
            username: zod_1.z.string(),
            email: zod_1.z.string(),
            firstName: zod_1.z.string(),
            lastName: zod_1.z.string(),
        }),
        expertProfile: expert_contracts_1.ExpertProfileSchema,
    }),
    pendingChanges: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()).optional(), // The changes awaiting approval
});
exports.ApproveExpertChangesRequestSchema = zod_1.z.object({
    expertId: zod_1.z.string(),
});
exports.ApproveExpertChangesResponseSchema = zod_1.z.object({
    success: zod_1.z.literal(true),
    message: zod_1.z.string(),
    expertProfile: expert_contracts_1.ExpertProfileSchema,
});
exports.RejectExpertChangesRequestSchema = zod_1.z.object({
    expertId: zod_1.z.string(),
    rejectionReasons: zod_1.z.string().array(),
});
exports.RejectExpertChangesResponseSchema = zod_1.z.object({
    success: zod_1.z.literal(true),
    message: zod_1.z.string(),
    expertProfile: expert_contracts_1.ExpertProfileSchema,
});
/**
 * Admin Dashboard Data
 */
exports.AdminDashboardResponseSchema = zod_1.z.object({
    stats: zod_1.z.object({
        totalUsers: zod_1.z.number(),
        totalExperts: zod_1.z.number(),
        verifiedExperts: zod_1.z.number(),
        pendingExperts: zod_1.z.number(),
        blockedUsers: zod_1.z.number(),
        unlistedUsers: zod_1.z.number(),
    }),
    recentActivity: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string(),
        type: zod_1.z.string(), // 'user_registered', 'expert_verified', 'expert_rejected', etc.
        description: zod_1.z.string(),
        timestamp: zod_1.z.string().datetime(),
        userId: zod_1.z.string().optional(),
    })),
});
/**
 * Admin Error Codes
 */
exports.AdminErrorCodeSchema = zod_1.z.enum([
    'ADMIN_ACCESS_REQUIRED',
    'USER_NOT_FOUND',
    'EXPERT_NOT_FOUND',
    'EXPERT_ALREADY_VERIFIED',
    'EXPERT_NOT_PENDING',
    'INVALID_ADMIN_ACTION',
    'INSUFFICIENT_PERMISSIONS',
    ...__1.auth.AuthErrorCodeSchema.options,
]);
exports.AdminErrorSchema = auth_contracts_1.AuthErrorSchema.extend({
    code: exports.AdminErrorCodeSchema,
});
//# sourceMappingURL=admin.contracts.js.map
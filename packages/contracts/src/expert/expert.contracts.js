"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpertErrorSchema = exports.ExpertErrorCodeSchema = exports.PublicExpertResponseSchema = exports.UpdateExpertProfileResponseSchema = exports.UpdateExpertProfileRequestSchema = exports.ExpertLoginResponseSchema = exports.ExpertLoginRequestSchema = exports.ExpertRegisterResponseSchema = exports.ExpertRegisterRequestSchema = exports.ExpertWithProfileSchema = exports.ExpertUserSchema = exports.ExpertProfileSchema = exports.VerificationStatusSchema = exports.UserRoleSchema = void 0;
const zod_1 = require("zod");
const auth_contracts_1 = require("../auth/auth.contracts");
/**
 * Expert role and verification contracts
 */
exports.UserRoleSchema = zod_1.z.enum(['USER', 'EXPERT', 'ADMIN']);
exports.VerificationStatusSchema = zod_1.z.enum([
    'PENDING',
    'VERIFIED',
    'REJECTED',
]);
exports.ExpertProfileSchema = zod_1.z.object({
    id: zod_1.z.string(),
    userId: zod_1.z.string(),
    verificationStatus: exports.VerificationStatusSchema,
    rejectionReasons: zod_1.z.string().array().default([]),
    verifiedAt: zod_1.z.string().datetime().optional(),
    verifiedBy: zod_1.z.string().optional(),
    specialization: zod_1.z.string().optional(),
    experience: zod_1.z.string().optional(),
    qualifications: zod_1.z.string().optional(), // JSON string
    bio: zod_1.z.string().optional(),
    website: zod_1.z.string().optional(),
    linkedin: zod_1.z.string().optional(),
    portfolio: zod_1.z.string().optional(),
    createdAt: zod_1.z.string().datetime(),
    updatedAt: zod_1.z.string().datetime(),
});
exports.ExpertUserSchema = auth_contracts_1.AuthUserSchema.extend({
    role: exports.UserRoleSchema,
    isBlocked: zod_1.z.boolean(),
    isUnlisted: zod_1.z.boolean(),
});
exports.ExpertWithProfileSchema = exports.ExpertUserSchema.extend({
    expertProfile: exports.ExpertProfileSchema.optional(),
});
/**
 * Expert Registration
 */
exports.ExpertRegisterRequestSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8).max(128),
    firstName: zod_1.z.string().min(1).max(100).trim(),
    lastName: zod_1.z.string().min(1).max(100).trim(),
    specialization: zod_1.z.string().optional(),
    experience: zod_1.z.string().optional(),
    qualifications: zod_1.z.string().optional(), // JSON string
    bio: zod_1.z.string().optional(),
    website: zod_1.z.string().optional(),
    linkedin: zod_1.z.string().optional(),
    portfolio: zod_1.z.string().optional(),
});
exports.ExpertRegisterResponseSchema = zod_1.z.object({
    success: zod_1.z.literal(true),
    username: zod_1.z.string().min(1).max(100),
    message: zod_1.z.string().optional(), // e.g., "Verification email sent. Your expert profile is pending admin approval."
});
/**
 * Expert Login (same as regular user login but with role validation)
 */
exports.ExpertLoginRequestSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
    rememberMe: zod_1.z.boolean().optional(),
});
exports.ExpertLoginResponseSchema = zod_1.z.object({
    user: exports.ExpertUserSchema,
    tokens: zod_1.z.object({
        accessToken: zod_1.z.string(),
        refreshToken: zod_1.z.string(),
        accessTokenExpiresIn: zod_1.z.number().int().positive(),
        refreshTokenExpiresIn: zod_1.z.number().int().positive().optional(),
        tokenType: zod_1.z.literal('Bearer').default('Bearer'),
    }),
});
/**
 * Expert Profile Management
 */
exports.UpdateExpertProfileRequestSchema = zod_1.z.object({
    specialization: zod_1.z.string().optional(),
    experience: zod_1.z.string().optional(),
    qualifications: zod_1.z.string().optional(), // JSON string
    bio: zod_1.z.string().optional(),
    website: zod_1.z.string().optional(),
    linkedin: zod_1.z.string().optional(),
    portfolio: zod_1.z.string().optional(),
});
exports.UpdateExpertProfileResponseSchema = zod_1.z.object({
    success: zod_1.z.literal(true),
    message: zod_1.z.string(), // "Your changes have been submitted for admin approval"
    pendingChanges: zod_1.z.boolean(), // true if changes require re-verification
});
/**
 * Public Expert Response (only verified experts)
 */
exports.PublicExpertResponseSchema = zod_1.z.object({
    user: zod_1.z.object({
        id: zod_1.z.string(),
        username: zod_1.z.string(),
        firstName: zod_1.z.string(),
        lastName: zod_1.z.string(),
    }),
    expertProfile: zod_1.z.object({
        specialization: zod_1.z.string().optional(),
        experience: zod_1.z.string().optional(),
        qualifications: zod_1.z.string().optional(),
        bio: zod_1.z.string().optional(),
        website: zod_1.z.string().optional(),
        linkedin: zod_1.z.string().optional(),
        portfolio: zod_1.z.string().optional(),
        verifiedAt: zod_1.z.string().datetime(),
    }),
});
/**
 * Expert Error Codes
 */
exports.ExpertErrorCodeSchema = zod_1.z.enum([
    'EXPERT_NOT_FOUND',
    'EXPERT_NOT_VERIFIED',
    'EXPERT_BLOCKED',
    'EXPERT_UNLISTED',
    'PROFILE_UPDATE_PENDING',
    'INVALID_EXPERT_DATA',
    ...auth_contracts_1.AuthErrorCodeSchema.options,
]);
exports.ExpertErrorSchema = auth_contracts_1.AuthErrorSchema.extend({
    code: exports.ExpertErrorCodeSchema,
});
//# sourceMappingURL=expert.contracts.js.map
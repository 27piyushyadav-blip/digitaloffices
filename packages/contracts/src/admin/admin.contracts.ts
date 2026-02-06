import { z } from 'zod';

import { auth } from '..';
import { AuthErrorSchema } from '../auth/auth.contracts';
import {
  ExpertProfileSchema,
  VerificationStatusSchema,
} from '../expert/expert.contracts';

/**
 * Admin Authentication
 */

export const AdminLoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  rememberMe: z.boolean().optional(),
});
export type AdminLoginRequest = z.infer<typeof AdminLoginRequestSchema>;

export const AdminLoginResponseSchema = z.object({
  user: z.object({
    id: z.string(),
    username: z.string(),
    email: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    emailVerified: z.boolean(),
    role: z.literal('ADMIN'),
    isBlocked: z.boolean(),
    isUnlisted: z.boolean(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  }),
  tokens: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    accessTokenExpiresIn: z.number().int().positive(),
    refreshTokenExpiresIn: z.number().int().positive().optional(),
    tokenType: z.literal('Bearer').default('Bearer'),
  }),
});
export type AdminLoginResponse = z.infer<typeof AdminLoginResponseSchema>;

/**
 * Admin Control Actions
 */

export const BlockUserRequestSchema = z.object({
  userId: z.string(),
  reason: z.string().optional(),
});
export type BlockUserRequest = z.infer<typeof BlockUserRequestSchema>;

export const BlockUserResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
});
export type BlockUserResponse = z.infer<typeof BlockUserResponseSchema>;

export const UnblockUserRequestSchema = z.object({
  userId: z.string(),
});
export type UnblockUserRequest = z.infer<typeof UnblockUserRequestSchema>;

export const UnblockUserResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
});
export type UnblockUserResponse = z.infer<typeof UnblockUserResponseSchema>;

export const UnlistUserRequestSchema = z.object({
  userId: z.string(),
  reason: z.string().optional(),
});
export type UnlistUserRequest = z.infer<typeof UnlistUserRequestSchema>;

export const UnlistUserResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
});
export type UnlistUserResponse = z.infer<typeof UnlistUserResponseSchema>;

export const ListUserRequestSchema = z.object({
  userId: z.string(),
});
export type ListUserRequest = z.infer<typeof ListUserRequestSchema>;

export const ListUserResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
});
export type ListUserResponse = z.infer<typeof ListUserResponseSchema>;

/**
 * Expert Verification Management
 */

export const GetPendingExpertsResponseSchema = z.object({
  experts: z.array(
    z.object({
      user: z.object({
        id: z.string(),
        username: z.string(),
        email: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        createdAt: z.string().datetime(),
      }),
      expertProfile: ExpertProfileSchema,
    }),
  ),
  total: z.number(),
});
export type GetPendingExpertsResponse = z.infer<
  typeof GetPendingExpertsResponseSchema
>;

export const ApproveExpertRequestSchema = z.object({
  expertId: z.string(),
});
export type ApproveExpertRequest = z.infer<typeof ApproveExpertRequestSchema>;

export const ApproveExpertResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  expertProfile: ExpertProfileSchema,
});
export type ApproveExpertResponse = z.infer<typeof ApproveExpertResponseSchema>;

export const RejectExpertRequestSchema = z.object({
  expertId: z.string(),
  rejectionReasons: z.string().array(),
});
export type RejectExpertRequest = z.infer<typeof RejectExpertRequestSchema>;

export const RejectExpertResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  expertProfile: ExpertProfileSchema,
});
export type RejectExpertResponse = z.infer<typeof RejectExpertResponseSchema>;

export const GetExpertChangesRequestSchema = z.object({
  expertId: z.string(),
});
export type GetExpertChangesRequest = z.infer<
  typeof GetExpertChangesRequestSchema
>;

export const GetExpertChangesResponseSchema = z.object({
  expert: z.object({
    user: z.object({
      id: z.string(),
      username: z.string(),
      email: z.string(),
      firstName: z.string(),
      lastName: z.string(),
    }),
    expertProfile: ExpertProfileSchema,
  }),
  pendingChanges: z.record(z.string(), z.unknown()).optional(), // The changes awaiting approval
});
export type GetExpertChangesResponse = z.infer<
  typeof GetExpertChangesResponseSchema
>;

export const ApproveExpertChangesRequestSchema = z.object({
  expertId: z.string(),
});
export type ApproveExpertChangesRequest = z.infer<
  typeof ApproveExpertChangesRequestSchema
>;

export const ApproveExpertChangesResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  expertProfile: ExpertProfileSchema,
});
export type ApproveExpertChangesResponse = z.infer<
  typeof ApproveExpertChangesResponseSchema
>;

export const RejectExpertChangesRequestSchema = z.object({
  expertId: z.string(),
  rejectionReasons: z.string().array(),
});
export type RejectExpertChangesRequest = z.infer<
  typeof RejectExpertChangesRequestSchema
>;

export const RejectExpertChangesResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  expertProfile: ExpertProfileSchema,
});
export type RejectExpertChangesResponse = z.infer<
  typeof RejectExpertChangesResponseSchema
>;

/**
 * Admin Dashboard Data
 */

export const AdminDashboardResponseSchema = z.object({
  stats: z.object({
    totalUsers: z.number(),
    totalExperts: z.number(),
    verifiedExperts: z.number(),
    pendingExperts: z.number(),
    blockedUsers: z.number(),
    unlistedUsers: z.number(),
  }),
  recentActivity: z.array(
    z.object({
      id: z.string(),
      type: z.string(), // 'user_registered', 'expert_verified', 'expert_rejected', etc.
      description: z.string(),
      timestamp: z.string().datetime(),
      userId: z.string().optional(),
    }),
  ),
});
export type AdminDashboardResponse = z.infer<
  typeof AdminDashboardResponseSchema
>;

/**
 * Admin Error Codes
 */

export const AdminErrorCodeSchema = z.enum([
  'ADMIN_ACCESS_REQUIRED',
  'USER_NOT_FOUND',
  'EXPERT_NOT_FOUND',
  'EXPERT_ALREADY_VERIFIED',
  'EXPERT_NOT_PENDING',
  'INVALID_ADMIN_ACTION',
  'INSUFFICIENT_PERMISSIONS',
  ...auth.AuthErrorCodeSchema.options,
]);
export type AdminErrorCode = z.infer<typeof AdminErrorCodeSchema>;

export const AdminErrorSchema = AuthErrorSchema.extend({
  code: AdminErrorCodeSchema,
});
export type AdminError = z.infer<typeof AdminErrorSchema>;

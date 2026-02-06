import { z } from 'zod';

import { auth } from '..';
import {
  AuthErrorCodeSchema,
  AuthErrorSchema,
  AuthUserSchema,
} from '../auth/auth.contracts';

/**
 * Expert role and verification contracts
 */

export const UserRoleSchema = z.enum(['USER', 'EXPERT', 'ADMIN']);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const VerificationStatusSchema = z.enum([
  'PENDING',
  'VERIFIED',
  'REJECTED',
]);
export type VerificationStatus = z.infer<typeof VerificationStatusSchema>;

export const ExpertProfileSchema = z.object({
  id: z.string(),
  userId: z.string(),
  verificationStatus: VerificationStatusSchema,
  rejectionReasons: z.string().array().default([]),
  verifiedAt: z.string().datetime().optional(),
  verifiedBy: z.string().optional(),
  specialization: z.string().optional(),
  experience: z.string().optional(),
  qualifications: z.string().optional(), // JSON string
  bio: z.string().optional(),
  website: z.string().optional(),
  linkedin: z.string().optional(),
  portfolio: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type ExpertProfile = z.infer<typeof ExpertProfileSchema>;

export const ExpertUserSchema = AuthUserSchema.extend({
  role: UserRoleSchema,
  isBlocked: z.boolean(),
  isUnlisted: z.boolean(),
});
export type ExpertUser = z.infer<typeof ExpertUserSchema>;

export const ExpertWithProfileSchema = ExpertUserSchema.extend({
  expertProfile: ExpertProfileSchema.optional(),
});
export type ExpertWithProfile = z.infer<typeof ExpertWithProfileSchema>;

/**
 * Expert Registration
 */

export const ExpertRegisterRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  firstName: z.string().min(1).max(100).trim(),
  lastName: z.string().min(1).max(100).trim(),
  specialization: z.string().optional(),
  experience: z.string().optional(),
  qualifications: z.string().optional(), // JSON string
  bio: z.string().optional(),
  website: z.string().optional(),
  linkedin: z.string().optional(),
  portfolio: z.string().optional(),
});
export type ExpertRegisterRequest = z.infer<typeof ExpertRegisterRequestSchema>;

export const ExpertRegisterResponseSchema = z.object({
  success: z.literal(true),
  username: z.string().min(1).max(100),
  message: z.string().optional(), // e.g., "Verification email sent. Your expert profile is pending admin approval."
});
export type ExpertRegisterResponse = z.infer<
  typeof ExpertRegisterResponseSchema
>;

/**
 * Expert Login (same as regular user login but with role validation)
 */

export const ExpertLoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  rememberMe: z.boolean().optional(),
});
export type ExpertLoginRequest = z.infer<typeof ExpertLoginRequestSchema>;

export const ExpertLoginResponseSchema = z.object({
  user: ExpertUserSchema,
  tokens: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    accessTokenExpiresIn: z.number().int().positive(),
    refreshTokenExpiresIn: z.number().int().positive().optional(),
    tokenType: z.literal('Bearer').default('Bearer'),
  }),
});
export type ExpertLoginResponse = z.infer<typeof ExpertLoginResponseSchema>;

/**
 * Expert Profile Management
 */

export const UpdateExpertProfileRequestSchema = z.object({
  specialization: z.string().optional(),
  experience: z.string().optional(),
  qualifications: z.string().optional(), // JSON string
  bio: z.string().optional(),
  website: z.string().optional(),
  linkedin: z.string().optional(),
  portfolio: z.string().optional(),
});
export type UpdateExpertProfileRequest = z.infer<
  typeof UpdateExpertProfileRequestSchema
>;

export const UpdateExpertProfileResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(), // "Your changes have been submitted for admin approval"
  pendingChanges: z.boolean(), // true if changes require re-verification
});
export type UpdateExpertProfileResponse = z.infer<
  typeof UpdateExpertProfileResponseSchema
>;

/**
 * Public Expert Response (only verified experts)
 */

export const PublicExpertResponseSchema = z.object({
  user: z.object({
    id: z.string(),
    username: z.string(),
    firstName: z.string(),
    lastName: z.string(),
  }),
  expertProfile: z.object({
    specialization: z.string().optional(),
    experience: z.string().optional(),
    qualifications: z.string().optional(),
    bio: z.string().optional(),
    website: z.string().optional(),
    linkedin: z.string().optional(),
    portfolio: z.string().optional(),
    verifiedAt: z.string().datetime(),
  }),
});
export type PublicExpertResponse = z.infer<typeof PublicExpertResponseSchema>;

/**
 * Expert Error Codes
 */

export const ExpertErrorCodeSchema = z.enum([
  'EXPERT_NOT_FOUND',
  'EXPERT_NOT_VERIFIED',
  'EXPERT_BLOCKED',
  'EXPERT_UNLISTED',
  'PROFILE_UPDATE_PENDING',
  'INVALID_EXPERT_DATA',
  ...AuthErrorCodeSchema.options,
]);
export type ExpertErrorCode = z.infer<typeof ExpertErrorCodeSchema>;

export const ExpertErrorSchema = AuthErrorSchema.extend({
  code: ExpertErrorCodeSchema,
});
export type ExpertError = z.infer<typeof ExpertErrorSchema>;

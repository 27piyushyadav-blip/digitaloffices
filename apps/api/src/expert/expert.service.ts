import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { JwtUtils } from '../auth/jwt.utils';
import { expert } from '@digitaloffices/contracts';
import { AuthService } from '../auth/auth.service';

/**
 * Expert Service
 *
 * Implements expert-specific business logic:
 * - Expert registration with profile creation
 * - Expert login with role validation
 * - Expert profile management with verification workflow
 * - Public expert listing (only verified experts)
 */

@Injectable()
export class ExpertService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtUtils: JwtUtils,
    private readonly emailService: EmailService,
    private readonly authService: AuthService,
  ) {}

  /**
   * Register a new expert with profile.
   * Creates user account with EXPERT role and expert profile in PENDING status.
   */
  async register(data: expert.ExpertRegisterRequest): Promise<expert.ExpertRegisterResponse> {
    // Use the existing auth service to create the user with EXPERT role
    const userResult = await this.authService.register({
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
    });

    // Get the created user
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new ConflictException({
        code: 'UNKNOWN',
        message: 'Failed to create user account',
      } as expert.ExpertError);
    }

    // Update user role to EXPERT
    await (this.prisma.user.update as any)({
      where: { id: user.id },
      data: { role: 'EXPERT' },
    });

    // Create expert profile
    try {
      await (this.prisma as any).expertProfile.create({
        data: {
          userId: user.id,
          specialization: data.specialization,
          experience: data.experience,
          qualifications: data.qualifications,
          bio: data.bio,
          website: data.website,
          linkedin: data.linkedin,
          portfolio: data.portfolio,
          verificationStatus: 'PENDING' as any,
        },
      });
    } catch (error) {
      // Rollback user creation if expert profile creation fails
      await this.prisma.user.delete({
        where: { id: user.id },
      });
      throw error;
    }

    return {
      success: true,
      username: userResult.username,
      message: 'Verification email sent. Your expert profile is pending admin approval.',
    };
  }

  /**
   * Login for experts with role validation.
   */
  async login(data: expert.ExpertLoginRequest): Promise<expert.ExpertLoginResponse> {
    // Use auth service for credential validation
    const authResult = await this.authService.login(data);

    // Verify user is an expert and not blocked
    const user = await (this.prisma.user.findUnique as any)({
      where: { id: authResult.user.id },
      include: { expertProfile: true },
    });

    if (!user || (user as any).role !== 'EXPERT') {
      throw new UnauthorizedException({
        code: 'EXPERT_NOT_FOUND',
        message: 'Expert account not found',
      } as expert.ExpertError);
    }

    if ((user as any).isBlocked) {
      throw new UnauthorizedException({
        code: 'EXPERT_BLOCKED',
        message: 'Expert account is blocked',
      } as expert.ExpertError);
    }

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        emailVerified: user.emailVerified,
        role: 'EXPERT' as any,
        isBlocked: (user as any).isBlocked,
        isUnlisted: (user as any).isUnlisted,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
      tokens: authResult.tokens,
    };
  }

  /**
   * Get expert profile (for the expert themselves).
   */
  async getExpertProfile(userId: string): Promise<expert.ExpertWithProfile> {
    const user = await (this.prisma.user.findUnique as any)({
      where: { id: userId },
      include: { expertProfile: true },
    });

    if (!user || (user as any).role !== 'EXPERT') {
      throw new NotFoundException({
        code: 'EXPERT_NOT_FOUND',
        message: 'Expert profile not found',
      } as expert.ExpertError);
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      emailVerified: user.emailVerified,
      role: 'EXPERT',
      isBlocked: (user as any).isBlocked,
      isUnlisted: (user as any).isUnlisted,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      expertProfile: (user as any).expertProfile ? {
        id: (user as any).expertProfile.id,
        userId: (user as any).expertProfile.userId,
        verificationStatus: (user as any).expertProfile.verificationStatus as expert.VerificationStatus,
        rejectionReasons: (user as any).expertProfile.rejectionReasons,
        verifiedAt: (user as any).expertProfile.verifiedAt?.toISOString(),
        specialization: (user as any).expertProfile.specialization,
        experience: (user as any).expertProfile.experience,
        qualifications: (user as any).expertProfile.qualifications,
        bio: (user as any).expertProfile.bio,
        website: (user as any).expertProfile.website,
        linkedin: (user as any).expertProfile.linkedin,
        portfolio: (user as any).expertProfile.portfolio,
        createdAt: (user as any).expertProfile.createdAt.toISOString(),
        updatedAt: (user as any).expertProfile.updatedAt.toISOString(),
      } : undefined,
    };
  }

  /**
   * Update expert profile.
   * Changes are stored as pending and require admin re-verification.
   */
  async updateExpertProfile(
    userId: string,
    data: expert.UpdateExpertProfileRequest,
  ): Promise<expert.UpdateExpertProfileResponse> {
    const expertProfile = await (this.prisma as any).expertProfile.findUnique({
      where: { userId },
    });

    if (!expertProfile) {
      throw new NotFoundException({
        code: 'EXPERT_NOT_FOUND',
        message: 'Expert profile not found',
      } as expert.ExpertError);
    }

    // If already verified, store changes as pending
    if ((expertProfile as any).verificationStatus === 'VERIFIED' as any) {
      await (this.prisma as any).expertProfile.update({
        where: { id: expertProfile.id },
        data: {
          pendingChanges: data,
        },
      });

      return {
        success: true,
        message: 'Your changes have been submitted for admin approval',
        pendingChanges: true,
      };
    }

    // If pending or rejected, update directly (still needs admin approval)
    const updatedProfile = await (this.prisma as any).expertProfile.update({
      where: { id: expertProfile.id },
      data: {
        ...data,
        verificationStatus: 'PENDING' as any, // Reset to pending for re-verification
        rejectionReasons: [], // Clear previous rejection reasons
      },
    });

    return {
      success: true,
      message: 'Your profile has been updated and submitted for admin approval',
      pendingChanges: true,
    };
  }

  /**
   * Get public expert information (only verified experts).
   */
  async getPublicExpert(username: string): Promise<expert.PublicExpertResponse> {
    const user = await (this.prisma.user.findUnique as any)({
      where: { username },
      include: { expertProfile: true },
    });

    if (!user ||
        (user as any).role !== 'EXPERT' ||
        (user as any).isBlocked ||
        (user as any).isUnlisted ||
        !(user as any).expertProfile ||
        (user as any).expertProfile.verificationStatus !== 'VERIFIED') {
      throw new NotFoundException({
        code: 'EXPERT_NOT_FOUND',
        message: 'Expert not found or not publicly available',
      } as expert.ExpertError);
    }

    return {
      user: {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      expertProfile: {
        specialization: (user as any).expertProfile.specialization,
        experience: (user as any).expertProfile.experience,
        qualifications: (user as any).expertProfile.qualifications,
        bio: (user as any).expertProfile.bio,
        website: (user as any).expertProfile.website,
        linkedin: (user as any).expertProfile.linkedin,
        portfolio: (user as any).expertProfile.portfolio,
        verifiedAt: (user as any).expertProfile.verifiedAt!,
      },
    };
  }

  /**
   * List all verified public experts.
   */
  async listPublicExperts(): Promise<expert.PublicExpertResponse[]> {
    const experts = await (this.prisma.user.findMany as any)({
      where: {
        role: 'EXPERT',
        isBlocked: false,
        isUnlisted: false,
        expertProfile: {
          verificationStatus: 'VERIFIED',
        },
      },
      include: { expertProfile: true },
      orderBy: { expertProfile: { verifiedAt: 'desc' } },
    });

    return experts.map((user: any) => ({
      user: {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      expertProfile: {
        specialization: (user as any).expertProfile!.specialization,
        experience: (user as any).expertProfile!.experience,
        qualifications: (user as any).expertProfile!.qualifications,
        bio: (user as any).expertProfile!.bio,
        website: (user as any).expertProfile!.website,
        linkedin: (user as any).expertProfile!.linkedin,
        portfolio: (user as any).expertProfile!.portfolio,
        verifiedAt: (user as any).expertProfile!.verifiedAt!,
      },
    }));
  }
}

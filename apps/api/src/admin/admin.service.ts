import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { admin } from '@digitaloffices/contracts';

/**
 * Admin Service
 *
 * Implements admin-specific business logic:
 * - Admin authentication
 * - User management (block/unblock, list/unlist)
 * - Expert verification management
 * - Admin dashboard data
 */

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Login for admins with role validation.
   */
  async login(data: admin.AdminLoginRequest): Promise<admin.AdminLoginResponse> {
    // This would typically use the auth service, but for now we'll implement directly
    // In a real implementation, you'd call authService.login and then validate role

    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user || (user as any).role !== 'ADMIN') {
      throw new UnauthorizedException({
        code: 'ADMIN_ACCESS_REQUIRED',
        message: 'Admin access required',
      } as admin.AdminError);
    }

    if ((user as any).isBlocked) {
      throw new UnauthorizedException({
        code: 'ADMIN_ACCESS_REQUIRED',
        message: 'Admin account is blocked',
      } as admin.AdminError);
    }

    // For now, return a mock response - in real implementation, generate tokens
    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        emailVerified: user.emailVerified,
        role: 'ADMIN',
        isBlocked: (user as any).isBlocked,
        isUnlisted: (user as any).isUnlisted,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
      tokens: {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        accessTokenExpiresIn: 3600,
        refreshTokenExpiresIn: 604800,
        tokenType: 'Bearer',
      },
    };
  }

  /**
   * Block a user.
   */
  async blockUser(data: admin.BlockUserRequest): Promise<admin.BlockUserResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) {
      throw new NotFoundException({
        code: 'USER_NOT_FOUND',
        message: 'User not found',
      } as admin.AdminError);
    }

    await this.prisma.user.update({
      where: { id: data.userId },
      data: { isBlocked: true as any },
    } as any);

    return {
      success: true,
      message: `User ${user.username} has been blocked`,
    };
  }

  /**
   * Unblock a user.
   */
  async unblockUser(data: admin.UnblockUserRequest): Promise<admin.UnblockUserResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) {
      throw new NotFoundException({
        code: 'USER_NOT_FOUND',
        message: 'User not found',
      } as admin.AdminError);
    }

    await this.prisma.user.update({
      where: { id: data.userId },
      data: { isBlocked: false as any },
    } as any);

    return {
      success: true,
      message: `User ${user.username} has been unblocked`,
    };
  }

  /**
   * Unlist a user (remove from public listings).
   */
  async unlistUser(data: admin.UnlistUserRequest): Promise<admin.UnlistUserResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) {
      throw new NotFoundException({
        code: 'USER_NOT_FOUND',
        message: 'User not found',
      } as admin.AdminError);
    }

    await this.prisma.user.update({
      where: { id: data.userId },
      data: { isUnlisted: true as any },
    } as any);

    return {
      success: true,
      message: `User ${user.username} has been unlisted`,
    };
  }

  /**
   * List a user (add back to public listings).
   */
  async listUser(data: admin.ListUserRequest): Promise<admin.ListUserResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) {
      throw new NotFoundException({
        code: 'USER_NOT_FOUND',
        message: 'User not found',
      } as admin.AdminError);
    }

    await this.prisma.user.update({
      where: { id: data.userId },
      data: { isUnlisted: false as any },
    } as any);

    return {
      success: true,
      message: `User ${user.username} has been listed`,
    };
  }

  /**
   * Get pending experts for admin review.
   */
  async getPendingExperts(): Promise<admin.GetPendingExpertsResponse> {
    const experts = await (this.prisma.user.findMany as any)({
      where: {
        role: 'EXPERT' as any,
        expertProfile: {
          verificationStatus: 'PENDING' as any,
        },
      },
      include: { expertProfile: true },
      orderBy: { expertProfile: { createdAt: 'desc' } },
    });

    return {
      experts: experts.map((user: any) => ({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          createdAt: user.createdAt.toISOString(),
        },
        expertProfile: {
          id: (user as any).expertProfile.id,
          userId: (user as any).expertProfile.userId,
          verificationStatus: (user as any).expertProfile.verificationStatus,
          rejectionReasons: (user as any).expertProfile.rejectionReasons,
          verifiedAt: (user as any).expertProfile.verifiedAt?.toISOString(),
          verifiedBy: (user as any).expertProfile.verifiedBy,
          specialization: (user as any).expertProfile.specialization,
          experience: (user as any).expertProfile.experience,
          qualifications: (user as any).expertProfile.qualifications,
          bio: (user as any).expertProfile.bio,
          website: (user as any).expertProfile.website,
          linkedin: (user as any).expertProfile.linkedin,
          portfolio: (user as any).expertProfile.portfolio,
          createdAt: (user as any).expertProfile.createdAt.toISOString(),
          updatedAt: (user as any).expertProfile.updatedAt.toISOString(),
        },
      })),
      total: experts.length,
    };
  }

  /**
   * Approve an expert.
   */
  async approveExpert(data: admin.ApproveExpertRequest, adminId: string): Promise<admin.ApproveExpertResponse> {
    const expertProfile = await (this.prisma as any).expertProfile.findUnique({
      where: { id: data.expertId },
      include: { user: true },
    });

    if (!expertProfile) {
      throw new NotFoundException({
        code: 'EXPERT_NOT_FOUND',
        message: 'Expert profile not found',
      } as admin.AdminError);
    }

    if ((expertProfile as any).verificationStatus === 'VERIFIED') {
      throw new BadRequestException({
        code: 'EXPERT_ALREADY_VERIFIED',
        message: 'Expert is already verified',
      } as admin.AdminError);
    }

    const updatedProfile = await (this.prisma as any).expertProfile.update({
      where: { id: data.expertId },
      data: {
        verificationStatus: 'VERIFIED' as any,
        verifiedAt: new Date(),
        verifiedBy: adminId,
        rejectionReasons: [],
      },
    });

    return {
      success: true,
      message: 'Expert has been approved',
      expertProfile: {
        id: updatedProfile.id,
        userId: updatedProfile.userId,
        verificationStatus: updatedProfile.verificationStatus as any,
        rejectionReasons: updatedProfile.rejectionReasons,
        verifiedAt: updatedProfile.verifiedAt?.toISOString(),
        verifiedBy: updatedProfile.verifiedBy,
        specialization: updatedProfile.specialization,
        experience: updatedProfile.experience,
        qualifications: updatedProfile.qualifications,
        bio: updatedProfile.bio,
        website: updatedProfile.website,
        linkedin: updatedProfile.linkedin,
        portfolio: updatedProfile.portfolio,
        createdAt: updatedProfile.createdAt.toISOString(),
        updatedAt: updatedProfile.updatedAt.toISOString(),
      },
    };
  }

  /**
   * Reject an expert.
   */
  async rejectExpert(data: admin.RejectExpertRequest, adminId: string): Promise<admin.RejectExpertResponse> {
    const expertProfile = await (this.prisma as any).expertProfile.findUnique({
      where: { id: data.expertId },
      include: { user: true },
    });

    if (!expertProfile) {
      throw new NotFoundException({
        code: 'EXPERT_NOT_FOUND',
        message: 'Expert profile not found',
      } as admin.AdminError);
    }

    if ((expertProfile as any).verificationStatus === 'VERIFIED') {
      throw new BadRequestException({
        code: 'EXPERT_ALREADY_VERIFIED',
        message: 'Cannot reject an already verified expert',
      } as admin.AdminError);
    }

    const updatedProfile = await (this.prisma as any).expertProfile.update({
      where: { id: data.expertId },
      data: {
        verificationStatus: 'REJECTED' as any,
        verifiedBy: adminId,
        rejectionReasons: data.rejectionReasons,
      },
    });

    return {
      success: true,
      message: 'Expert has been rejected',
      expertProfile: {
        id: updatedProfile.id,
        userId: updatedProfile.userId,
        verificationStatus: updatedProfile.verificationStatus as any,
        rejectionReasons: updatedProfile.rejectionReasons,
        verifiedAt: updatedProfile.verifiedAt?.toISOString(),
        verifiedBy: updatedProfile.verifiedBy,
        specialization: updatedProfile.specialization,
        experience: updatedProfile.experience,
        qualifications: updatedProfile.qualifications,
        bio: updatedProfile.bio,
        website: updatedProfile.website,
        linkedin: updatedProfile.linkedin,
        portfolio: updatedProfile.portfolio,
        createdAt: updatedProfile.createdAt.toISOString(),
        updatedAt: updatedProfile.updatedAt.toISOString(),
      },
    };
  }

  /**
   * Get expert changes for admin review.
   */
  async getExpertChanges(data: admin.GetExpertChangesRequest): Promise<admin.GetExpertChangesResponse> {
    const user = await (this.prisma.user.findUnique as any)({
      where: { id: data.expertId },
      include: { expertProfile: true },
    });

    if (!user || (user as any).role !== 'EXPERT') {
      throw new NotFoundException({
        code: 'EXPERT_NOT_FOUND',
        message: 'Expert not found',
      } as admin.AdminError);
    }

    return {
      expert: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        expertProfile: (user as any).expertProfile ? {
          id: (user as any).expertProfile.id,
          userId: (user as any).expertProfile.userId,
          verificationStatus: (user as any).expertProfile.verificationStatus,
          rejectionReasons: (user as any).expertProfile.rejectionReasons,
          verifiedAt: (user as any).expertProfile.verifiedAt?.toISOString(),
          verifiedBy: (user as any).expertProfile.verifiedBy,
          specialization: (user as any).expertProfile.specialization,
          experience: (user as any).expertProfile.experience,
          qualifications: (user as any).expertProfile.qualifications,
          bio: (user as any).expertProfile.bio,
          website: (user as any).expertProfile.website,
          linkedin: (user as any).expertProfile.linkedin,
          portfolio: (user as any).expertProfile.portfolio,
          createdAt: (user as any).expertProfile.createdAt.toISOString(),
          updatedAt: (user as any).expertProfile.updatedAt.toISOString(),
        } : null as any,
      },
      pendingChanges: (user as any).expertProfile?.pendingChanges as any,
    };
  }

  /**
   * Approve expert changes.
   */
  async approveExpertChanges(data: admin.ApproveExpertChangesRequest, adminId: string): Promise<admin.ApproveExpertChangesResponse> {
    const expertProfile = await (this.prisma as any).expertProfile.findUnique({
      where: { userId: data.expertId },
    });

    if (!expertProfile) {
      throw new NotFoundException({
        code: 'EXPERT_NOT_FOUND',
        message: 'Expert profile not found',
      } as admin.AdminError);
    }

    if (!(expertProfile as any).pendingChanges) {
      throw new BadRequestException({
        code: 'EXPERT_NOT_PENDING',
        message: 'No pending changes to approve',
      } as admin.AdminError);
    }

    const pendingChanges = (expertProfile as any).pendingChanges;

    const updatedProfile = await (this.prisma as any).expertProfile.update({
      where: { userId: data.expertId },
      data: {
        ...pendingChanges,
        verificationStatus: 'VERIFIED' as any,
        verifiedAt: new Date(),
        verifiedBy: adminId,
        pendingChanges: null,
        rejectionReasons: [],
      },
    });

    return {
      success: true,
      message: 'Expert changes have been approved',
      expertProfile: {
        id: updatedProfile.id,
        userId: updatedProfile.userId,
        verificationStatus: updatedProfile.verificationStatus as any,
        rejectionReasons: updatedProfile.rejectionReasons,
        verifiedAt: updatedProfile.verifiedAt?.toISOString(),
        verifiedBy: updatedProfile.verifiedBy,
        specialization: updatedProfile.specialization,
        experience: updatedProfile.experience,
        qualifications: updatedProfile.qualifications,
        bio: updatedProfile.bio,
        website: updatedProfile.website,
        linkedin: updatedProfile.linkedin,
        portfolio: updatedProfile.portfolio,
        createdAt: updatedProfile.createdAt.toISOString(),
        updatedAt: updatedProfile.updatedAt.toISOString(),
      },
    };
  }

  /**
   * Reject expert changes.
   */
  async rejectExpertChanges(data: admin.RejectExpertChangesRequest, adminId: string): Promise<admin.RejectExpertChangesResponse> {
    const expertProfile = await (this.prisma as any).expertProfile.findUnique({
      where: { userId: data.expertId },
    });

    if (!expertProfile) {
      throw new NotFoundException({
        code: 'EXPERT_NOT_FOUND',
        message: 'Expert profile not found',
      } as admin.AdminError);
    }

    if (!(expertProfile as any).pendingChanges) {
      throw new BadRequestException({
        code: 'EXPERT_NOT_PENDING',
        message: 'No pending changes to reject',
      } as admin.AdminError);
    }

    const updatedProfile = await (this.prisma as any).expertProfile.update({
      where: { userId: data.expertId },
      data: {
        verificationStatus: 'VERIFIED' as any, // Keep verified status
        pendingChanges: null,
        rejectionReasons: data.rejectionReasons,
      },
    });

    return {
      success: true,
      message: 'Expert changes have been rejected',
      expertProfile: {
        id: updatedProfile.id,
        userId: updatedProfile.userId,
        verificationStatus: updatedProfile.verificationStatus as any,
        rejectionReasons: updatedProfile.rejectionReasons,
        verifiedAt: updatedProfile.verifiedAt?.toISOString(),
        verifiedBy: updatedProfile.verifiedBy,
        specialization: updatedProfile.specialization,
        experience: updatedProfile.experience,
        qualifications: updatedProfile.qualifications,
        bio: updatedProfile.bio,
        website: updatedProfile.website,
        linkedin: updatedProfile.linkedin,
        portfolio: updatedProfile.portfolio,
        createdAt: updatedProfile.createdAt.toISOString(),
        updatedAt: updatedProfile.updatedAt.toISOString(),
      },
    };
  }

  /**
   * Get admin dashboard data.
   */
  async getDashboardData(): Promise<admin.AdminDashboardResponse> {
    const [
      totalUsers,
      totalExperts,
      verifiedExperts,
      pendingExperts,
      blockedUsers,
      unlistedUsers,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { role: 'EXPERT' as any } } as any),
      this.prisma.user.count({
        where: {
          role: 'EXPERT' as any,
          expertProfile: { verificationStatus: 'VERIFIED' as any },
        },
      } as any),
      this.prisma.user.count({
        where: {
          role: 'EXPERT' as any,
          expertProfile: { verificationStatus: 'PENDING' as any },
        },
      } as any),
      this.prisma.user.count({ where: { isBlocked: true as any } } as any),
      this.prisma.user.count({ where: { isUnlisted: true as any } } as any),
    ]);

    return {
      stats: {
        totalUsers,
        totalExperts,
        verifiedExperts,
        pendingExperts,
        blockedUsers,
        unlistedUsers,
      },
      recentActivity: [], // TODO: Implement activity tracking
    };
  }
}

import { Body, Controller, Get, Post, Put, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { admin } from '@digitaloffices/contracts';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from './guards/admin.guard';

/**
 * Admin Controller
 *
 * Contract-driven routes for admin authentication and user management.
 * All request/response types are inferred from contracts - no manual DTOs.
 */

// Request DTOs created from Zod schemas
class AdminLoginDto extends createZodDto(admin.AdminLoginRequestSchema) {}
class BlockUserDto extends createZodDto(admin.BlockUserRequestSchema) {}
class UnblockUserDto extends createZodDto(admin.UnblockUserRequestSchema) {}
class UnlistUserDto extends createZodDto(admin.UnlistUserRequestSchema) {}
class ListUserDto extends createZodDto(admin.ListUserRequestSchema) {}
class ApproveExpertDto extends createZodDto(admin.ApproveExpertRequestSchema) {}
class RejectExpertDto extends createZodDto(admin.RejectExpertRequestSchema) {}
class GetExpertChangesDto extends createZodDto(admin.GetExpertChangesRequestSchema) {}
class ApproveExpertChangesDto extends createZodDto(admin.ApproveExpertChangesRequestSchema) {}
class RejectExpertChangesDto extends createZodDto(admin.RejectExpertChangesRequestSchema) {}

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  @ApiOperation({
    summary: 'Login as admin',
    description: 'Authenticates admin with email/password. Validates admin role and status.',
  })
  @ApiResponse({
    status: 200,
    description: 'Admin login successful',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials or admin access required',
  })
  async login(@Body() dto: AdminLoginDto): Promise<admin.AdminLoginResponse> {
    return this.adminService.login(dto);
  }

  @Post('users/block')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({
    summary: 'Block a user',
    description: 'Blocks a user (experts, organizations, or others). Requires admin authentication.',
  })
  @ApiResponse({
    status: 200,
    description: 'User blocked successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - requires admin authentication',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async blockUser(@Body() dto: BlockUserDto): Promise<admin.BlockUserResponse> {
    return this.adminService.blockUser(dto);
  }

  @Post('users/unblock')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({
    summary: 'Unblock a user',
    description: 'Unblocks a previously blocked user. Requires admin authentication.',
  })
  @ApiResponse({
    status: 200,
    description: 'User unblocked successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - requires admin authentication',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async unblockUser(@Body() dto: UnblockUserDto): Promise<admin.UnblockUserResponse> {
    return this.adminService.unblockUser(dto);
  }

  @Post('users/unlist')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({
    summary: 'Unlist a user',
    description: 'Removes a user from public listings. Requires admin authentication.',
  })
  @ApiResponse({
    status: 200,
    description: 'User unlisted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - requires admin authentication',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async unlistUser(@Body() dto: UnlistUserDto): Promise<admin.UnlistUserResponse> {
    return this.adminService.unlistUser(dto);
  }

  @Post('users/list')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({
    summary: 'List a user',
    description: 'Adds a user back to public listings. Requires admin authentication.',
  })
  @ApiResponse({
    status: 200,
    description: 'User listed successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - requires admin authentication',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async listUser(@Body() dto: ListUserDto): Promise<admin.ListUserResponse> {
    return this.adminService.listUser(dto);
  }

  @Get('experts/pending')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({
    summary: 'Get pending experts',
    description: 'Returns all experts awaiting admin approval. Requires admin authentication.',
  })
  @ApiResponse({
    status: 200,
    description: 'Pending experts retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - requires admin authentication',
  })
  async getPendingExperts(): Promise<admin.GetPendingExpertsResponse> {
    return this.adminService.getPendingExperts();
  }

  @Post('experts/approve')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({
    summary: 'Approve an expert',
    description: 'Approves an expert and makes them publicly visible. Requires admin authentication.',
  })
  @ApiResponse({
    status: 200,
    description: 'Expert approved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - requires admin authentication',
  })
  @ApiResponse({
    status: 404,
    description: 'Expert not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Expert already verified',
  })
  async approveExpert(
    @Body() dto: ApproveExpertDto,
    @Request() req: { user: { userId: string } },
  ): Promise<admin.ApproveExpertResponse> {
    return this.adminService.approveExpert(dto, req.user.userId);
  }

  @Post('experts/reject')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({
    summary: 'Reject an expert',
    description: 'Rejects an expert with provided reasons. Requires admin authentication.',
  })
  @ApiResponse({
    status: 200,
    description: 'Expert rejected successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - requires admin authentication',
  })
  @ApiResponse({
    status: 404,
    description: 'Expert not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Cannot reject already verified expert',
  })
  async rejectExpert(
    @Body() dto: RejectExpertDto,
    @Request() req: { user: { userId: string } },
  ): Promise<admin.RejectExpertResponse> {
    return this.adminService.rejectExpert(dto, req.user.userId);
  }

  @Get('experts/:expertId/changes')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({
    summary: 'Get expert changes',
    description: 'Returns pending changes for an expert profile. Requires admin authentication.',
  })
  @ApiResponse({
    status: 200,
    description: 'Expert changes retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - requires admin authentication',
  })
  @ApiResponse({
    status: 404,
    description: 'Expert not found',
  })
  async getExpertChanges(
    @Request() req: { params: { expertId: string } },
  ): Promise<admin.GetExpertChangesResponse> {
    return this.adminService.getExpertChanges({ expertId: req.params.expertId });
  }

  @Post('experts/approve-changes')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({
    summary: 'Approve expert changes',
    description: 'Approves pending changes to an expert profile. Requires admin authentication.',
  })
  @ApiResponse({
    status: 200,
    description: 'Expert changes approved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - requires admin authentication',
  })
  @ApiResponse({
    status: 404,
    description: 'Expert not found',
  })
  @ApiResponse({
    status: 400,
    description: 'No pending changes to approve',
  })
  async approveExpertChanges(
    @Body() dto: ApproveExpertChangesDto,
    @Request() req: { user: { userId: string } },
  ): Promise<admin.ApproveExpertChangesResponse> {
    return this.adminService.approveExpertChanges(dto, req.user.userId);
  }

  @Post('experts/reject-changes')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({
    summary: 'Reject expert changes',
    description: 'Rejects pending changes to an expert profile. Requires admin authentication.',
  })
  @ApiResponse({
    status: 200,
    description: 'Expert changes rejected successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - requires admin authentication',
  })
  @ApiResponse({
    status: 404,
    description: 'Expert not found',
  })
  @ApiResponse({
    status: 400,
    description: 'No pending changes to reject',
  })
  async rejectExpertChanges(
    @Body() dto: RejectExpertChangesDto,
    @Request() req: { user: { userId: string } },
  ): Promise<admin.RejectExpertChangesResponse> {
    return this.adminService.rejectExpertChanges(dto, req.user.userId);
  }

  @Get('dashboard')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({
    summary: 'Get admin dashboard data',
    description: 'Returns dashboard statistics and recent activity. Requires admin authentication.',
  })
  @ApiResponse({
    status: 200,
    description: 'Dashboard data retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - requires admin authentication',
  })
  async getDashboard(): Promise<admin.AdminDashboardResponse> {
    return this.adminService.getDashboardData();
  }
}

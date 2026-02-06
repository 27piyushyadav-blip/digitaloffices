import { Body, Controller, Get, Post, Put, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { expert } from '@digitaloffices/contracts';
import { ExpertService } from './expert.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ExpertGuard } from './guards/expert.guard';

/**
 * Expert Controller
 *
 * Contract-driven routes for expert authentication and profile management.
 * All request/response types are inferred from contracts - no manual DTOs.
 */

// Request DTOs created from Zod schemas
class ExpertRegisterDto extends createZodDto(expert.ExpertRegisterRequestSchema) {}
class ExpertLoginDto extends createZodDto(expert.ExpertLoginRequestSchema) {}
class UpdateExpertProfileDto extends createZodDto(expert.UpdateExpertProfileRequestSchema) {}

@ApiTags('experts')
@Controller('experts')
export class ExpertController {
  constructor(private readonly expertService: ExpertService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register a new expert',
    description: 'Creates a new expert account with profile. Expert status starts as PENDING and requires admin approval.',
  })
  @ApiResponse({
    status: 201,
    description: 'Expert registered successfully, verification email sent',
  })
  @ApiResponse({
    status: 409,
    description: 'Email already in use',
  })
  async register(@Body() dto: ExpertRegisterDto): Promise<expert.ExpertRegisterResponse> {
    return this.expertService.register(dto);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Login as expert',
    description: 'Authenticates expert with email/password. Validates expert role and status.',
  })
  @ApiResponse({
    status: 200,
    description: 'Expert login successful',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials or expert not found/blocked',
  })
  async login(@Body() dto: ExpertLoginDto): Promise<expert.ExpertLoginResponse> {
    return this.expertService.login(dto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard, ExpertGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({
    summary: 'Get expert profile',
    description: 'Returns the expert\'s profile including verification status and rejection reasons if any.',
  })
  @ApiResponse({
    status: 200,
    description: 'Expert profile retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - requires expert authentication',
  })
  @ApiResponse({
    status: 404,
    description: 'Expert profile not found',
  })
  async getProfile(@Request() req: { user: { userId: string } }): Promise<expert.ExpertWithProfile> {
    return this.expertService.getExpertProfile(req.user.userId);
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard, ExpertGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({
    summary: 'Update expert profile',
    description: 'Updates expert profile. Changes require admin re-verification if expert was previously verified.',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully, pending admin approval',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - requires expert authentication',
  })
  @ApiResponse({
    status: 404,
    description: 'Expert profile not found',
  })
  async updateProfile(
    @Request() req: { user: { userId: string } },
    @Body() dto: UpdateExpertProfileDto,
  ): Promise<expert.UpdateExpertProfileResponse> {
    return this.expertService.updateExpertProfile(req.user.userId, dto);
  }

  @Get('public/:username')
  @ApiOperation({
    summary: 'Get public expert information',
    description: 'Returns public expert information. Only available for verified, unblocked, and listed experts.',
  })
  @ApiResponse({
    status: 200,
    description: 'Public expert information retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Expert not found or not publicly available',
  })
  async getPublicExpert(@Request() req: { params: { username: string } }): Promise<expert.PublicExpertResponse> {
    return this.expertService.getPublicExpert(req.params.username);
  }

  @Get('public')
  @ApiOperation({
    summary: 'List all public experts',
    description: 'Returns a list of all verified, unblocked, and listed experts.',
  })
  @ApiResponse({
    status: 200,
    description: 'Public experts list retrieved successfully',
  })
  async listPublicExperts(): Promise<expert.PublicExpertResponse[]> {
    return this.expertService.listPublicExperts();
  }
}

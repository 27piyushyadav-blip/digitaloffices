import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { auth } from '@digitaloffices/contracts';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

/**
 * Auth Controller
 *
 * Contract-driven routes using Zod schemas from @digitaloffices/contracts.
 * All request/response types are inferred from contracts - no manual DTOs.
 */

// Request DTOs created from Zod schemas
class RegisterDto extends createZodDto(auth.RegisterRequestSchema) {}
class LoginCredentialsDto extends createZodDto(auth.LoginCredentialsRequestSchema) {}
class GoogleOAuthDto extends createZodDto(auth.GoogleOAuthRequestSchema) {}
class VerifyEmailDto extends createZodDto(auth.VerifyEmailRequestSchema) {}
class RefreshTokenDto extends createZodDto(auth.RefreshTokenRequestSchema) {}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
    description:
      'Creates a new user account and triggers email verification. Does NOT return tokens or user data - user must verify email first.',
  })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully, verification email sent',
  })
  @ApiResponse({
    status: 409,
    description: 'Email already in use',
  })
  async register(@Body() dto: RegisterDto): Promise<auth.RegisterResponse> {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Login with credentials',
    description: 'Authenticates user with email/password credentials. Returns full AuthSession (user + tokens).',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful, returns user and tokens',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  async login(
    @Body() dto: LoginCredentialsDto,
  ): Promise<auth.LoginCredentialsResponse> {
    return this.authService.login(dto);
  }

  @Post('google')
  @ApiOperation({
    summary: 'Google OAuth authentication',
    description: 'Authenticates user via Google OAuth ID token. Returns full AuthSession (user + tokens).',
  })
  @ApiResponse({
    status: 200,
    description: 'OAuth authentication successful',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired Google token',
  })
  async googleOAuth(
    @Body() dto: GoogleOAuthDto,
  ): Promise<auth.GoogleOAuthResponse> {
    return this.authService.googleOAuth(dto);
  }

  @Post('email/verify')
  @ApiOperation({
    summary: 'Verify email address',
    description: 'Verifies email ownership using token from verification link. Returns full AuthSession (auto-login after verification).',
  })
  @ApiResponse({
    status: 200,
    description: 'Email verified successfully, user logged in',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid or expired verification token',
  })
  async verifyEmail(@Body() dto: VerifyEmailDto): Promise<auth.VerifyEmailResponse> {
    return this.authService.verifyEmail(dto);
  }

  @Post('email/request-verification')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({
    summary: 'Request email verification',
    description: 'Requests a new verification email for the authenticated user. Requires authentication.',
  })
  @ApiResponse({
    status: 200,
    description: 'Verification email sent successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - requires authentication',
  })
  async requestEmailVerification(
    @Request() req: { user: { userId: string } },
  ): Promise<auth.RequestEmailVerificationResponse> {
    return this.authService.requestEmailVerification(req.user.userId);
  }

  @Post('refresh')
  @ApiOperation({
    summary: 'Refresh access token',
    description: 'Refreshes access token using refresh token. Returns full AuthSession with new tokens.',
  })
  @ApiResponse({
    status: 200,
    description: 'Tokens refreshed successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired refresh token',
  })
  async refreshToken(
    @Body() dto: RefreshTokenDto,
  ): Promise<auth.RefreshTokenResponse> {
    return this.authService.refreshToken(dto);
  }
}

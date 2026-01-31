import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import * as crypto from 'crypto';
import { Prisma } from '@prisma/client';
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { auth } from '@digitaloffices/contracts';
import { JwtUtils } from './jwt.utils';

/**
 * Auth Service
 *
 * Implements authentication business logic:
 * - Registration (creates user, sends verification email)
 * - Login with credentials
 * - Google OAuth
 * - Email verification
 * - Token refresh
 *
 * All responses conform to contracts from @digitaloffices/contracts.
 */

@Injectable()
export class AuthService {
  private readonly googleClient: OAuth2Client;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtUtils: JwtUtils,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {
    const googleClientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    this.googleClient = new OAuth2Client(googleClientId);
  }

  /**
   * Register a new user account.
   * Backend generates a unique username. Email uniqueness is enforced by DB constraint;
   * duplicate email results in EMAIL_ALREADY_IN_USE (no pre-check).
   */
  async register(data: auth.RegisterRequest): Promise<auth.RegisterResponse> {
    const passwordHash = await bcrypt.hash(data.password, 10);
    const maxUsernameAttempts = 5;

    for (let attempt = 0; attempt < maxUsernameAttempts; attempt++) {
      const username = this.generateUsername();
      try {
        const user = await this.prisma.user.create({
          data: {
            username,
            email: data.email,
            passwordHash,
            firstName: data.firstName,
            lastName: data.lastName,
            provider: 'credentials',
          },
        });

        const tokenRecord = await this.createEmailVerificationToken(user.id);
        await this.emailService.sendVerificationEmail(
          user.email,
          user.firstName,
          tokenRecord.token,
        );

        return {
          success: true,
          username: user.username,
          message: 'Verification email sent',
        };
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
          const target = (error.meta?.target as string[] | undefined) ?? [];
          if (target.includes('email')) {
            throw new ConflictException({
              code: 'EMAIL_ALREADY_IN_USE',
              message: 'Email is already registered',
            } as auth.AuthError);
          }
          if (target.includes('username')) {
            continue; // retry with new username
          }
        }
        throw error;
      }
    }

    throw new ConflictException({
      code: 'UNKNOWN',
      message: 'Unable to generate unique username. Please try again.',
    } as auth.AuthError);
  }

  /**
   * Generate a human-readable username (URL-safe) using unique-names-generator.
   */
  private generateUsername(): string {
    return uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
      separator: '-',
      length: 3,
      style: 'lowerCase',
    });
  }

  /**
   * Validate email/password credentials.
   * Returns user if valid, throws if invalid.
   * Used by login and Passport strategies.
   */
  async validateCredentials(
    email: string,
    password: string,
  ): Promise<{ id: string; username: string; email: string; firstName: string; lastName: string; emailVerified: boolean; createdAt: Date; updatedAt: Date }> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException({
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password',
      } as auth.AuthError);
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw new UnauthorizedException({
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password',
      } as auth.AuthError);
    }

    return user;
  }

  /**
   * Login with email/password credentials.
   * Returns full AuthSession.
   */
  async login(
    data: auth.LoginCredentialsRequest,
  ): Promise<auth.LoginCredentialsResponse> {
    const user = await this.validateCredentials(data.email, data.password);

    // Check email verification (optional - can be made required)
    // if (!user.emailVerified) {
    //   throw new UnauthorizedException({
    //     code: 'EMAIL_NOT_VERIFIED',
    //     message: 'Please verify your email before logging in',
    //   } as auth.AuthError);
    // }

    // Generate tokens
    const tokens = await this.jwtUtils.generateTokens(user.id, user.email);

    // Store refresh token in database
    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: tokens.refreshToken,
        expiresAt: new Date(
          Date.now() + (tokens.refreshTokenExpiresIn || 604800) * 1000,
        ),
      },
    });

    return {
      user: this.mapUserToAuthUser(user),
      tokens,
    };
  }

  /**
   * Authenticate via Google OAuth ID token.
   * Returns full AuthSession.
   */
  async googleOAuth(data: auth.GoogleOAuthRequest): Promise<auth.GoogleOAuthResponse> {
    try {
      // Verify Google ID token
      const ticket = await this.googleClient.verifyIdToken({
        idToken: data.idToken,
        audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new UnauthorizedException({
          code: 'OAUTH_ERROR',
          message: 'Invalid Google token',
        } as auth.AuthError);
      }

      const googleId = payload.sub;
      const email = payload.email;
      const firstName = payload.given_name || '';
      const lastName = payload.family_name || '';
      const emailVerified = payload.email_verified || false;

      if (!email) {
        throw new BadRequestException({
          code: 'OAUTH_ERROR',
          message: 'Email not provided by Google',
        } as auth.AuthError);
      }

      // Find or create user
      let user = await this.prisma.user.findFirst({
        where: {
          OR: [
            { email },
            { providerId: googleId, provider: 'google' },
          ],
        },
      });

      if (user) {
        // Update existing user
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: {
            provider: 'google',
            providerId: googleId,
            emailVerified: emailVerified || user.emailVerified,
            firstName: firstName || user.firstName,
            lastName: lastName || user.lastName,
          },
        });
      } else {
        // Create new user with backend-generated username (retry on username collision)
        const maxAttempts = 5;
        let newUser: Awaited<ReturnType<PrismaService['user']['create']>> | null = null;
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
          const username = this.generateUsername();
          try {
            newUser = await this.prisma.user.create({
              data: {
                username,
                email,
                firstName,
                lastName,
                provider: 'google',
                providerId: googleId,
                emailVerified,
              },
            });
            break;
          } catch (createError) {
            if (
              createError instanceof Prisma.PrismaClientKnownRequestError &&
              createError.code === 'P2002' &&
              (createError.meta?.target as string[] | undefined)?.includes('username')
            ) {
              if (attempt === maxAttempts - 1) throw createError;
              continue;
            }
            throw createError;
          }
        }
        user = newUser!;
      }

      // Generate tokens
      const tokens = await this.jwtUtils.generateTokens(user.id, user.email);

      // Store refresh token
      await this.prisma.refreshToken.create({
        data: {
          userId: user.id,
          token: tokens.refreshToken,
          expiresAt: new Date(
            Date.now() + (tokens.refreshTokenExpiresIn || 604800) * 1000,
          ),
        },
      });

      return {
        user: this.mapUserToAuthUser(user),
        tokens,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof BadRequestException) {
        throw error;
      }
      throw new UnauthorizedException({
        code: 'OAUTH_ERROR',
        message: 'Google authentication failed',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
      } as auth.AuthError);
    }
  }

  /**
   * Verify email using verification token.
   * Returns full AuthSession (auto-login).
   */
  async verifyEmail(data: auth.VerifyEmailRequest): Promise<auth.VerifyEmailResponse> {
    const tokenRecord = await this.prisma.emailVerificationToken.findUnique({
      where: { token: data.token },
      include: { user: true },
    });

    if (!tokenRecord) {
      throw new NotFoundException({
        code: 'INVALID_OR_EXPIRED_TOKEN',
        message: 'Invalid verification token',
      } as auth.AuthError);
    }

    if (tokenRecord.usedAt) {
      throw new BadRequestException({
        code: 'INVALID_OR_EXPIRED_TOKEN',
        message: 'Verification token already used',
      } as auth.AuthError);
    }

    if (tokenRecord.expiresAt < new Date()) {
      throw new BadRequestException({
        code: 'INVALID_OR_EXPIRED_TOKEN',
        message: 'Verification token expired',
      } as auth.AuthError);
    }

    // Mark token as used and verify email
    const user = await this.prisma.user.update({
      where: { id: tokenRecord.userId },
      data: {
        emailVerified: true,
        emailVerifiedAt: new Date(),
      },
    });

    await this.prisma.emailVerificationToken.update({
      where: { id: tokenRecord.id },
      data: { usedAt: new Date() },
    });

    // Generate tokens (auto-login)
    const tokens = await this.jwtUtils.generateTokens(user.id, user.email);

    // Store refresh token
    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: tokens.refreshToken,
        expiresAt: new Date(
          Date.now() + (tokens.refreshTokenExpiresIn || 604800) * 1000,
        ),
      },
    });

    return {
      user: this.mapUserToAuthUser(user),
      tokens,
    };
  }

  /**
   * Request a new email verification email.
   * Requires authenticated user.
   */
  async requestEmailVerification(
    userId: string,
  ): Promise<auth.RequestEmailVerificationResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException({
        code: 'UNAUTHENTICATED',
        message: 'User not found',
      } as auth.AuthError);
    }

    if (user.emailVerified) {
      throw new BadRequestException({
        code: 'EMAIL_ALREADY_IN_USE',
        message: 'Email already verified',
      } as auth.AuthError);
    }

    // Create new verification token
    const tokenRecord = await this.createEmailVerificationToken(userId);

    // Send verification email
    await this.emailService.sendVerificationEmail(
      user.email,
      user.firstName,
      tokenRecord.token,
    );

    return { success: true };
  }

  /**
   * Refresh access token using refresh token.
   * Returns full AuthSession with new tokens.
   */
  async refreshToken(
    data: auth.RefreshTokenRequest,
  ): Promise<auth.RefreshTokenResponse> {
    // Verify refresh token JWT
    let payload;
    try {
      payload = await this.jwtUtils.verifyRefreshToken(data.refreshToken);
    } catch {
      throw new UnauthorizedException({
        code: 'INVALID_OR_EXPIRED_TOKEN',
        message: 'Invalid refresh token',
      } as auth.AuthError);
    }

    // Check if token exists in database and is not revoked
    const tokenRecord = await this.prisma.refreshToken.findUnique({
      where: { token: data.refreshToken },
      include: { user: true },
    });

    if (!tokenRecord || tokenRecord.revokedAt || tokenRecord.expiresAt < new Date()) {
      throw new UnauthorizedException({
        code: 'INVALID_OR_EXPIRED_TOKEN',
        message: 'Refresh token invalid or expired',
      } as auth.AuthError);
    }

    // Revoke old token
    await this.prisma.refreshToken.update({
      where: { id: tokenRecord.id },
      data: { revokedAt: new Date() },
    });

    // Generate new tokens
    const tokens = await this.jwtUtils.generateTokens(
      tokenRecord.user.id,
      tokenRecord.user.email,
    );

    // Store new refresh token
    await this.prisma.refreshToken.create({
      data: {
        userId: tokenRecord.user.id,
        token: tokens.refreshToken,
        expiresAt: new Date(
          Date.now() + (tokens.refreshTokenExpiresIn || 604800) * 1000,
        ),
      },
    });

    return {
      user: this.mapUserToAuthUser(tokenRecord.user),
      tokens,
    };
  }

  /**
   * Helper: Create email verification token.
   * Returns the token record for use in email sending.
   */
  private async createEmailVerificationToken(userId: string) {
    const token = this.generateSecureToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    return this.prisma.emailVerificationToken.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });
  }

  /**
   * Helper: Generate secure random token.
   */
  private generateSecureToken(): string {
    return Buffer.from(crypto.getRandomValues(new Uint8Array(32)))
      .toString('base64url');
  }

  /**
   * Helper: Map Prisma User to AuthUser contract.
   */
  private mapUserToAuthUser(user: {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): auth.AuthUser {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}

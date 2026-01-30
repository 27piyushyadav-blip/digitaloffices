import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { auth } from '@digitaloffices/contracts';

/**
 * JWT utilities for token generation and validation.
 * Uses contract types for consistency.
 */

export interface TokenPayload {
  sub: string; // user ID
  email: string;
  type: 'access' | 'refresh';
}

@Injectable()
export class JwtUtils {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Generate access and refresh tokens for a user.
   */
  async generateTokens(userId: string, email: string): Promise<auth.AuthTokens> {
    const accessTokenExpiresIn = this.configService.get<number>(
      'JWT_ACCESS_EXPIRES_IN',
      3600, // 1 hour default
    );
    const refreshTokenExpiresIn = this.configService.get<number>(
      'JWT_REFRESH_EXPIRES_IN',
      604800, // 7 days default
    );

    const accessPayload: TokenPayload = {
      sub: userId,
      email,
      type: 'access',
    };

    const refreshPayload: TokenPayload = {
      sub: userId,
      email,
      type: 'refresh',
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessPayload, {
        expiresIn: accessTokenExpiresIn,
        secret: this.configService.get<string>('JWT_SECRET'),
      }),
      this.jwtService.signAsync(refreshPayload, {
        expiresIn: refreshTokenExpiresIn,
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      accessTokenExpiresIn,
      refreshTokenExpiresIn,
      tokenType: 'Bearer',
    };
  }

  /**
   * Verify and decode an access token.
   */
  async verifyAccessToken(token: string): Promise<TokenPayload> {
    return this.jwtService.verifyAsync<TokenPayload>(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
  }

  /**
   * Verify and decode a refresh token.
   */
  async verifyRefreshToken(token: string): Promise<TokenPayload> {
    return this.jwtService.verifyAsync<TokenPayload>(token, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });
  }
}

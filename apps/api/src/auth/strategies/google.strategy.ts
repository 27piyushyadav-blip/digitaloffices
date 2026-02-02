import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { auth } from '@digitaloffices/contracts';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<auth.AuthUser> {
    // This strategy is for OAuth flow (redirect-based)
    // For ID token flow (used in our controller), we handle it directly in the service
    // This strategy can be used if you want to add redirect-based OAuth later
    const { id, emails, name } = profile;
    const email = emails[0].value;

    const result = await this.authService.googleOAuth({
      idToken: accessToken, // In redirect flow, we'd need to exchange code for token
    });

    return result.user;
  }
}

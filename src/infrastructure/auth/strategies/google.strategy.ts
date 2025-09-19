import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Profile, Strategy, StrategyOptions } from 'passport-google-oauth20';
import { AuthResponseDto } from '@/core/application/dto/auth/auth.dto';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly logger = new Logger(GoogleStrategy.name);

  constructor(configService: ConfigService) {
    const clientID = configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET');
    const callbackURL =
      configService.get<string>('GOOGLE_CALLBACK_URL') ||
      'http://localhost:9000/api/v1/auth/google/redirect';

    if (!clientID || !clientSecret) {
      throw new Error(
        'Missing Google OAuth configuration. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file.',
      );
    }

    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['email', 'profile'],
    } as StrategyOptions);

    this.logger.log(`Using Google OAuth callback URL: ${callbackURL}`);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<AuthResponseDto> {
    const avatar =
      profile.photos?.[0]?.value ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        profile.displayName ?? 'User',
      )}&background=random`;

    return {
      provider: 'google',
      providerId: profile.id,
      email: profile.emails?.[0]?.value ?? '',
      name: profile.displayName ?? '',
      avatar,
      accessToken,
      refreshToken,
    };
  }
}

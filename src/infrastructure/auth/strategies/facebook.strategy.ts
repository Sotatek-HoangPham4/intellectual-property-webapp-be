import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Profile, Strategy, StrategyOptions } from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor() {
    super(<StrategyOptions>{
      clientID: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      callbackURL:
        process.env.FACEBOOK_CALLBACK_URL ||
        'http://localhost:9000/auth/facebook/redirect',
      profileFields: ['id', 'emails', 'name', 'picture.type(large)'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    return {
      provider: 'facebook',
      providerId: profile.id,
      email: profile.emails?.[0]?.value ?? null,
      name: `${profile.name?.givenName ?? ''} ${profile.name?.familyName ?? ''}`.trim(),
      avatar: profile.photos?.[0]?.value ?? null,
      accessToken,
    };
  }
}

import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import { TokenService } from '../../core/domain/services/token.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtTokenService implements TokenService {
  constructor(private readonly config: ConfigService) {}

  async generateAccessToken(payload: Record<string, any>): Promise<string> {
    return this.signToken(
      payload,
      this.config.get<string>('jwt.accessTokenSecret') ?? 'change_me',
      this.config.get<string>('jwt.accessTokenExpiration') ?? '15m',
    );
  }

  async generateRefreshToken(payload: Record<string, any>): Promise<string> {
    return this.signToken(
      payload,
      this.config.get<string>('jwt.refreshTokenSecret') ?? 'change_me_refresh',
      this.config.get<string>('jwt.refreshTokenExpiration') ?? '7d',
    );
  }

  private async signToken(
    payload: Record<string, any>,
    secret: string,
    expiresIn: string,
  ): Promise<string> {
    return jwt.sign(payload, secret, { expiresIn });
  }

  async verifyRefreshToken(token: string): Promise<Record<string, any> | null> {
    const secret =
      this.config.get<string>('jwt.refreshTokenSecret') ?? 'change_me_refresh';

    try {
      const decoded = jwt.verify(token, secret) as Record<string, any>;
      console.log('[Decoded Refresh Token]', decoded);
      return decoded;
    } catch (err: any) {
      console.error('[Verify Refresh Token] Error:', err.message);
      return null;
    }
  }

  hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}

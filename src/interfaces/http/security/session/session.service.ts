import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class SessionService {
  constructor(@Inject('SessionRepository') private readonly repo: any) {}

  async createSessionForLogin(params: {
    userId: string;
    ip?: string;
    userAgent?: string;
    refreshToken?: string | null;
  }) {
    let refreshTokenHash = null;
    if (params.refreshToken) {
      const bcrypt = require('bcrypt');
      const salt = await bcrypt.genSalt(10);
      refreshTokenHash = await bcrypt.hash(params.refreshToken, salt);
    }
    return this.repo.createSession({
      userId: params.userId,
      ip: params.ip,
      userAgent: params.userAgent,
      refreshTokenHash,
    });
  }

  async listSessions(userId: string) {
    return this.repo.findSessionsByUser(userId);
  }

  async revokeSession(userId: string, sessionId: string) {
    return this.repo.revokeSession(sessionId, userId);
  }

  async revokeAll(userId: string) {
    return this.repo.revokeAllSessions(userId);
  }
}

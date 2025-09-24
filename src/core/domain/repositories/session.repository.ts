import { SessionOrmEntity } from '@/infrastructure/db/entities/session.orm-entity';

export interface SessionRepository {
  createSession(payload: {
    userId: string;
    ip?: string | null;
    userAgent?: string | null;
    refreshTokenHash?: string | null;
  }): Promise<{ id: string }>;

  findSessionsByUser(userId: string): Promise<
    Array<{
      id: string;
      ip?: string | null;
      userAgent?: string | null;
      createdAt: Date;
      lastSeen?: Date | null;
      revoked: boolean;
    }>
  >;

  revokeSession(sessionId: string, userId: string): Promise<void>;

  revokeAllSessions(userId: string): Promise<void>;

  findById(sessionId: string): Promise<SessionOrmEntity | null>;
}

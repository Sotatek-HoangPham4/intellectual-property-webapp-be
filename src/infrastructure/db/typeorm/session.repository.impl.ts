import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { SessionOrmEntity } from '@/infrastructure/db/entities/session.orm-entity';

@Injectable()
export class SessionRepositoryImpl {
  private repo: Repository<SessionOrmEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(SessionOrmEntity);
  }

  async createSession(session: Partial<SessionOrmEntity>) {
    const s = this.repo.create(session);
    return this.repo.save(s);
  }

  async findSessionsByUser(userId: string) {
    return this.repo.find({ where: { userId, revoked: false } });
  }

  async revokeSession(sessionId: string, userId: string) {
    await this.repo.update({ id: sessionId, userId }, { revoked: true });
  }

  async revokeAllSessions(userId: string) {
    await this.repo.update({ userId }, { revoked: true });
  }
}

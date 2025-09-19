import { Inject, Injectable } from '@nestjs/common';
import { IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshTokenRepository } from '../../../core/domain/repositories/refresh-token.repository';
import { RefreshToken } from '../../../core/domain/entities/refresh-token.entity';
import { RefreshTokenOrmEntity } from '../entities/refresh-token.orm-entity';
import type { IUserRepository } from '@/core/domain/repositories/user.repository';
import { config } from '@/config';

@Injectable()
export class TypeOrmRefreshTokenRepository implements RefreshTokenRepository {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepo: IUserRepository,

    @InjectRepository(RefreshTokenOrmEntity)
    private readonly repo: Repository<RefreshTokenOrmEntity>,
  ) {}

  private toDomain(e: RefreshTokenOrmEntity): RefreshToken {
    return new RefreshToken(
      e.id,
      e.userId,
      e.tokenHash,
      e.expiresAt,
      e.revokedAt,
      e.createdAt,
    );
  }

  async findByUserId(userId: string): Promise<RefreshToken | null> {
    const user = await this.userRepo.findById(userId);
    if (!user || !user.currentHashedRefreshToken) return null;

    return new RefreshToken(
      user.id,
      user.id,
      user.currentHashedRefreshToken,
      new Date(Date.now() + config.refreshTokenTTLDays * 24 * 60 * 60 * 1000),
      null,
      new Date(),
    );
  }

  async findByTokenHash(tokenHash: string): Promise<RefreshToken | null> {
    const r = await this.repo.findOne({ where: { tokenHash } });
    return r ? this.toDomain(r) : null;
  }

  async save(token: RefreshToken): Promise<void> {
    await this.repo.insert({
      id: token.id,
      userId: token.userId,
      tokenHash: token.tokenHash,
      expiresAt: token.expiresAt,
      revokedAt: token.revokedAt,
      createdAt: token.createdAt,
    } as RefreshTokenOrmEntity);
  }

  async revokeById(id: string): Promise<void> {
    await this.repo.update({ id }, { revokedAt: new Date() });
  }

  async revokeAllByUserId(userId: string): Promise<number> {
    const result = await this.repo.update(
      { userId, revokedAt: undefined },
      { revokedAt: new Date() },
    );
    return result.affected ?? 0;
  }
}

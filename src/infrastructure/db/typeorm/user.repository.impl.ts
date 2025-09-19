// infrastructure/database/user.repository.impl.ts
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import type { IUserRepository } from '@/core/domain/repositories/user.repository';
import { UserEntity } from '@/core/domain/entities/user.entity';
import { UserOrmEntity } from '../entities/user.orm-entity';
import { hashToken } from '@/shared/utils/hash-token';

@Injectable()
export class UserRepositoryImpl implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repo: Repository<UserOrmEntity>,
  ) {}

  async create(user: UserEntity): Promise<UserEntity> {
    const created = this.repo.create(user);
    return await this.repo.save(created);
  }

  async findById(id: string): Promise<UserEntity | null> {
    return await this.repo.findOne({ where: { id } });
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.repo.find();
  }

  async update(user: UserEntity): Promise<UserEntity> {
    await this.repo.save(user);
    return user;
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.repo.findOne({ where: { email } });
  }

  async setCurrentRefreshToken(
    userId: string,
    hashedToken: string | null,
  ): Promise<void> {
    await this.repo.update(
      { id: userId },
      { currentHashedRefreshToken: hashedToken },
    );
  }

  async findByProvider(
    provider: string,
    providerId: string,
  ): Promise<UserEntity | null> {
    return await this.repo.findOne({
      where: { provider, providerId },
    });
  }

  async setResetPasswordToken(
    userId: string,
    hashedToken: string,
    expiresInMinutes: number,
  ) {
    await this.repo.update(userId, {
      resetPasswordToken: hashedToken,
      resetTokenExpiresAt: new Date(Date.now() + expiresInMinutes * 60000),
    });
  }

  async findByResetToken(token: string) {
    const hashedToken = hashToken(token);

    const user = await this.repo.findOne({
      where: {
        resetPasswordToken: hashedToken,
        resetTokenExpiresAt: MoreThan(new Date()),
      },
    });

    return user || null;
  }

  async updatePassword(userId: string, hashedPassword: string) {
    await this.repo.update(userId, { password: hashedPassword });
  }

  async clearResetToken(userId: string) {
    await this.repo.update(userId, {
      resetPasswordToken: null,
      resetTokenExpiresAt: null,
    });
  }
}

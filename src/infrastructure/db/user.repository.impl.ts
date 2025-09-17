// infrastructure/database/user.repository.impl.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import type { IUserRepository } from '@/core/domain/repositories/user.repository';
import { UserEntity } from '@/core/domain/entities/user.entity';
import { UserOrmEntity } from './entities/user.orm-entity';

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
}

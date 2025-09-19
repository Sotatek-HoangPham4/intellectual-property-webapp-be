import { Injectable, ConflictException } from '@nestjs/common';
import type { IUserRepository } from '@/core/domain/repositories/user.repository';
import { UserEntity } from '@/core/domain/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(
    name: string,
    email: string,
    password: string,
  ): Promise<UserEntity> {
    const existing = await this.userRepo.findByEmail(email);
    if (existing) throw new ConflictException('Email already registered');

    const hashed = await bcrypt.hash(password, 10);
    const user = new UserEntity('', name, email, hashed);
    return this.userRepo.create(user);
  }
}

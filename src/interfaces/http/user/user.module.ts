import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from '@/infrastructure/db/entities/user.orm-entity';
import { UserController } from './user.controller';
import { UserRepositoryImpl } from '@/infrastructure/db/user.repository.impl';
import { BcryptService } from '@/infrastructure/security/bcrypt.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity]), AuthModule],
  controllers: [UserController],
  providers: [UserRepositoryImpl, BcryptService],
})
export class UserModule {}

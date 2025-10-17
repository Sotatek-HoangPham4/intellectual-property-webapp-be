import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from '@/infrastructure/db/entities/user.orm-entity';
import { UserController } from './user.controller';
import { UserRepositoryImpl } from '@/infrastructure/db/typeorm/user.repository.impl';
import { BcryptService } from '@/infrastructure/security/bcrypt.service';
import { AuthModule } from '../auth/auth.module';
import { CredentialOrmEntity } from '@/infrastructure/db/entities/credential.orm-entity';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserOrmEntity, CredentialOrmEntity]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [
    BcryptService,
    UserService,
    {
      provide: 'IUserRepository',
      useClass: UserRepositoryImpl,
    },
  ],
  exports: ['IUserRepository', UserService],
})
export class UserModule {}

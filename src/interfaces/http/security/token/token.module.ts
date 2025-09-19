import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenServiceAdapter } from './token.service';
import { TokenController } from './token.controller';
import { BcryptService } from '@/infrastructure/security/bcrypt.service';

import { UserRepositoryImpl } from '@/infrastructure/db/typeorm/user.repository.impl';
import { UserOrmEntity } from '@/infrastructure/db/entities/user.orm-entity';
import { RefreshTokenOrmEntity } from '@/infrastructure/db/entities/refresh-token.orm-entity';
import { TypeOrmRefreshTokenRepository } from '@/infrastructure/db/typeorm/refresh-token.repository';
import { JwtTokenService } from '@/infrastructure/security/jwt.service';
import { RefreshTokenUseCase } from '@/core/application/use-cases/security/token/refresh-token.use-case';
import { RevokeTokenUseCase } from '@/core/application/use-cases/security/token/revoke-token.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([RefreshTokenOrmEntity, UserOrmEntity])],
  providers: [
    TypeOrmRefreshTokenRepository,
    JwtTokenService,
    BcryptService,
    {
      provide: 'IUserRepository',
      useClass: UserRepositoryImpl,
    },
    {
      provide: RefreshTokenUseCase,
      useFactory: (
        repo: TypeOrmRefreshTokenRepository,
        jwtService: JwtTokenService,
        bcryptService: BcryptService,
      ) => new RefreshTokenUseCase(repo, jwtService, bcryptService),
      inject: [TypeOrmRefreshTokenRepository, JwtTokenService, BcryptService],
    },
    {
      provide: RevokeTokenUseCase,
      useFactory: (
        repo: TypeOrmRefreshTokenRepository,
        jwtService: JwtTokenService,
      ) => new RevokeTokenUseCase(repo, jwtService),
      inject: [TypeOrmRefreshTokenRepository, JwtTokenService],
    },
    TokenServiceAdapter,
  ],
  controllers: [TokenController],
  exports: [TokenServiceAdapter, TypeOrmRefreshTokenRepository],
})
export class TokenModule {}

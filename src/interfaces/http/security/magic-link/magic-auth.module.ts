import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MagicLinkTokenOrmEntity } from '@/infrastructure/db/entities/magic-link-token.orm-entity';
import { MagicLinkTokenRepository } from '@/infrastructure/db/typeorm/magic-link-token.repository';
import { MagicAuthService } from './magic-auth.service';

import { JwtTokenService } from '@/infrastructure/security/jwt.service';
import { MagicAuthController } from './magic-auth.controller';
import { RequestMagicLinkUseCase } from '@/core/application/use-cases/security/magic-link/request-magic-link.use-case';
import { VerifyMagicLinkUseCase } from '@/core/application/use-cases/security/magic-link/verify-magic-link.usecase';
import { EmailService } from '@/infrastructure/notification/email/email.service';
import { UserRepositoryImpl } from '@/infrastructure/db/typeorm/user.repository.impl';
import { UserOrmEntity } from '@/infrastructure/db/entities/user.orm-entity';
import { EmailModule } from '@/infrastructure/notification/email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MagicLinkTokenOrmEntity, UserOrmEntity]),
    EmailModule,
  ],
  controllers: [MagicAuthController],
  providers: [
    MagicAuthService,
    MagicLinkTokenRepository,
    {
      provide: 'IUserRepository',
      useClass: UserRepositoryImpl,
    },
    RequestMagicLinkUseCase,
    VerifyMagicLinkUseCase,
    JwtTokenService,
  ],
})
export class MagicAuthModule {}

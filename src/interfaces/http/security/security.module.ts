import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserOrmEntity } from '@/infrastructure/db/entities/user.orm-entity';
import { UserRepositoryImpl } from '@/infrastructure/db/typeorm/user.repository.impl';
import { BcryptService } from '@/infrastructure/security/bcrypt.service';
import { JwtStrategy } from '@/infrastructure/auth/jwt.strategy';
import { GoogleStrategy } from '@/infrastructure/auth/strategies/google.strategy';
import { FacebookStrategy } from '@/infrastructure/auth/strategies/facebook.strategy';

import { PasswordController } from './password/password.controller';
import { PasswordService } from './password/password.service';
import { TwoFactorAuthController } from './2fa/2fa.controller';
import { TwoFactorAuthService } from './2fa/2fa.service';
import { TokenModule } from './token/token.module';
import { MagicAuthModule } from './magic-link/magic-auth.module';
import { SessionModule } from './session/session.module';

import { EmailModule } from '@/infrastructure/notification/email/email.module';

@Module({
  imports: [
    ConfigModule,
    EmailModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
    TypeOrmModule.forFeature([UserOrmEntity]),
    TokenModule,
    SessionModule,
    MagicAuthModule,
  ],
  controllers: [PasswordController, TwoFactorAuthController],
  providers: [
    PasswordService,
    TwoFactorAuthService,
    BcryptService,
    GoogleStrategy,
    FacebookStrategy,
    JwtStrategy,
    {
      provide: 'IUserRepository',
      useClass: UserRepositoryImpl,
    },
  ],
  exports: [
    PasswordService,
    TwoFactorAuthService,
    TokenModule,
    MagicAuthModule,
  ],
})
export class SecurityModule {}

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from '@/infrastructure/db/entities/user.orm-entity';
import { AuthService } from '@/interfaces/http/auth/auth.service';
import { BcryptService } from '@/infrastructure/security/bcrypt.service';
import { UserRepositoryImpl } from '@/infrastructure/db/typeorm/user.repository.impl';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '@/infrastructure/auth/jwt.strategy';
import { GoogleStrategy } from '@/infrastructure/auth/strategies/google.strategy';
import { FacebookStrategy } from '@/infrastructure/auth/strategies/facebook.strategy';
import { TwoFactorAuthController } from '../security/2fa/2fa.controller';
import { TwoFactorAuthService } from '../security/2fa/2fa.service';
import { PasswordController } from '../security/password/password.controller';
import { PasswordService } from '../security/password/password.service';
import { SessionService } from '../security/session/session.service';
import { SessionModule } from '../security/session/session.module';

@Module({
  imports: [
    ConfigModule,
    SessionModule,
    JwtModule.register({}),
    TypeOrmModule.forFeature([UserOrmEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AuthController, PasswordController, TwoFactorAuthController],
  providers: [
    AuthService,
    SessionService,
    PasswordService,
    TwoFactorAuthService,
    BcryptService,
    GoogleStrategy,
    FacebookStrategy,
    {
      provide: 'IUserRepository',
      useClass: UserRepositoryImpl,
    },
    JwtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}

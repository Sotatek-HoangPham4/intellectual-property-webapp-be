import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from '@/infrastructure/db/entities/user.orm-entity';
import { AuthService } from '@/interfaces/http/auth/auth.service';
import { BcryptService } from '@/infrastructure/bcrypt/bcrypt.service';
import { UserRepositoryImpl } from '@/infrastructure/db/user.repository.impl';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '@/infrastructure/auth/jwt.strategy';
import { GoogleStrategy } from '@/infrastructure/auth/strategies/google.strategy';
import { FacebookStrategy } from '@/infrastructure/auth/strategies/facebook.strategy';

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({}),
    TypeOrmModule.forFeature([UserOrmEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
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

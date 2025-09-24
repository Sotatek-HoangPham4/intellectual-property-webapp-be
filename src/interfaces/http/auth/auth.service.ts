import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Inject,
  NotFoundException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { UserEntity } from '../../../core/domain/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { BcryptService } from '../../../infrastructure/security/bcrypt.service';
import { ConfigService } from '@nestjs/config';
import type { IUserRepository } from '@/core/domain/repositories/user.repository';
import { RegisterResDto } from '../../../core/application/dto/auth/register.dto';
import { TokensDto } from '../../../core/application/dto/security/token/tokens.dto';
import { UserDataDto } from '../../../core/application/dto/user/user.dto';
import { randomUUID } from 'crypto';
import { hashToken } from '@/shared/utils/hash-token';
import { SessionService } from '../security/session/session.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepo: IUserRepository,
    private readonly jwtService: JwtService,
    private readonly bcryptService: BcryptService,
    private readonly config: ConfigService,
    private readonly sessionService: SessionService,
  ) {}

  private async getTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get('jwt.accessTokenSecret'),
      expiresIn: this.config.get('jwt.accessTokenExpiration'),
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get('jwt.refreshTokenSecret'),
      expiresIn: this.config.get('jwt.refreshTokenExpiration'),
    });
    return { accessToken, refreshToken };
  }

  async generateTokensForUser(userId: string, email: string, role: string) {
    const tokens = await this.getTokens(userId, email, role);
    const hashedRt = await this.bcryptService.hash(tokens.refreshToken);
    await this.userRepo.setCurrentRefreshToken(userId, hashedRt);
    return tokens;
  }

  async getUserById(userId: string): Promise<UserEntity> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    return user;
  }

  async register(
    name: string,
    email: string,
    password: string,
  ): Promise<UserDataDto> {
    if (await this.userRepo.findByEmail(email)) {
      throw new ConflictException('Email already registered');
    }

    const hashed = await this.bcryptService.hash(password);
    const userId = uuidv4();
    const user = new UserEntity(
      userId,
      name,
      email,
      hashed,
      null,
      'local',
      null,
      'user',
    );

    const created = await this.userRepo.create(user);
    const tokens = await this.getTokens(
      created.id,
      created.email,
      created.role,
    );
    await this.userRepo.setCurrentRefreshToken(
      created.id,
      await this.bcryptService.hash(tokens.refreshToken),
    );

    return new UserDataDto(
      created,
      new TokensDto(tokens.accessToken, tokens.refreshToken),
    );
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new UnauthorizedException('User does not exist');

    const pwMatches = await this.bcryptService.compare(
      password,
      user.password!,
    );
    if (!pwMatches)
      throw new UnauthorizedException('Username or password incorrect');

    const tokens = await this.getTokens(user.id, user.email, user.role);
    const hashedRt = await this.bcryptService.hash(tokens.refreshToken);
    await this.userRepo.setCurrentRefreshToken(user.id, hashedRt);

    await this.sessionService.createSessionForLogin({
      userId: user.id,
      refreshToken: tokens.refreshToken,
      ip: '127.0.0.1',
      userAgent: 'Postman',
    });

    return {
      ...tokens,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        provider: user.provider,
        providerId: user.providerId,
        avatar: user.avatar,
      },
    };
  }

  async logout(userId: string) {
    if (!userId || userId.trim() === '') {
      throw new UnauthorizedException('Invalid userId');
    }
    await this.userRepo.setCurrentRefreshToken(userId, null);
  }

  async refreshTokens(userId: string, refreshToken: string) {
    if (!userId || userId.trim() === '') {
      throw new UnauthorizedException('Invalid userId');
    }
    const user = await this.userRepo.findById(userId);
    if (!user || !user.currentHashedRefreshToken)
      throw new UnauthorizedException('Access denied');

    const rtMatches = await this.bcryptService.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );
    if (!rtMatches) throw new UnauthorizedException('Access denied');

    const tokens = await this.getTokens(user.id, user.email, user.role);
    const hashedRt = await this.bcryptService.hash(tokens.refreshToken);
    await this.userRepo.setCurrentRefreshToken(user.id, hashedRt);
    return tokens;
  }

  async socialLogin(profile: {
    provider: string;
    providerId: string;
    email?: string;
    name?: string;
    avatar?: string;
  }): Promise<UserDataDto> {
    let user = await this.userRepo.findByProvider(
      profile.provider,
      profile.providerId,
    );

    if (!user) {
      user = await this.userRepo.create(
        new UserEntity(
          uuidv4(),
          profile.name ?? 'New User',
          profile.email ??
            `${profile.provider}-${profile.providerId}@noemail.local`,
          '',
          profile.avatar ?? null,
          profile.provider,
          profile.providerId,
          'user',
        ),
      );
    } else if (!user.avatar && profile.avatar) {
      user.avatar = profile.avatar;
      await this.userRepo.update(user);
    }

    const tokens = await this.getTokens(user.id, user.email, user.role);
    const hashedRt = await this.bcryptService.hash(tokens.refreshToken);
    await this.userRepo.setCurrentRefreshToken(user.id, hashedRt);

    return new UserDataDto(
      user,
      new TokensDto(tokens.accessToken, tokens.refreshToken),
    );
  }
}

import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { UserEntity } from '../../../core/domain/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { BcryptService } from '../../../infrastructure/bcrypt/bcrypt.service';
import { ConfigService } from '@nestjs/config';
import type { IUserRepository } from '@/core/domain/repositories/user.repository';
import { AuthResponseDto } from './dto/auth.dto';
import { RegisterResDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('IUserRepository') private readonly userRepo: IUserRepository,
    private readonly jwtService: JwtService,
    private readonly bcryptService: BcryptService,
    private readonly config: ConfigService,
  ) {}

  async generateTokensForUser(userId: string, email: string, role: string) {
    const tokens = await this.getTokens(userId, email, role);
    const hashedRt = await this.bcryptService.hash(tokens.refreshToken);
    await this.userRepo.setCurrentRefreshToken(userId, hashedRt);
    return tokens;
  }

  async register(
    name: string,
    email: string,
    password: string,
  ): Promise<RegisterResDto> {
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

    return {
      ...tokens,
      user: {
        id: created.id,
        name: created.name,
        email: created.email,
        provider: 'local',
        providerId: null,
        avatar: null,
      },
    };
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const pwMatches = await this.bcryptService.compare(
      password,
      user.password!,
    );
    if (!pwMatches) throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.getTokens(user.id, user.email, user.role);
    const hashedRt = await this.bcryptService.hash(tokens.refreshToken);
    await this.userRepo.setCurrentRefreshToken(user.id, hashedRt);
    return {
      ...tokens,
      user: { id: user.id, name: user.name, email: user.email },
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

  async socialLogin(profile: {
    provider: string;
    providerId: string;
    email?: string;
    name?: string;
    avatar?: string;
  }) {
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

    const tokens = await this.generateTokensForUser(
      user.id,
      user.email,
      user.role,
    );

    return {
      provider: profile.provider,
      providerId: profile.providerId,
      email: user.email,
      name: user.name,
      avatar: user.avatar ?? profile.avatar ?? null,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }
}

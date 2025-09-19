import * as crypto from 'crypto';
import {
  UnauthorizedException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import {
  RefreshTokenRequestDto,
  RefreshTokenResponseDto,
} from '@/core/application/dto/auth/refresh.dto';
import { RefreshToken } from '@/core/domain/entities/refresh-token.entity';
import { config } from '@/config';
import { RefreshTokenRepository } from '@/core/domain/repositories/refresh-token.repository';
import { TokenService } from '@/core/domain/services/token.service';

export class RefreshTokenUseCase {
  constructor(
    private readonly refreshTokenRepo: RefreshTokenRepository,
    private readonly tokenService: TokenService,
    private readonly bcryptService: any,
    private readonly accessTokenTTLSeconds = config.accessTokenTTLSeconds,
    private readonly refreshTokenTTLSeconds = config.refreshTokenTTLSeconds,
  ) {}

  async execute(
    input: RefreshTokenRequestDto,
  ): Promise<RefreshTokenResponseDto> {
    const decoded = await this.tokenService.verifyRefreshToken(
      input.refreshToken,
    );
    if (!decoded?.sub) {
      throw new UnauthorizedException('Invalid refresh token payload');
    }

    const stored = await this.refreshTokenRepo.findByUserId(decoded.sub);

    if (!stored) throw new NotFoundException('Refresh token not found');
    if (stored.isRevoked())
      throw new ForbiddenException('Refresh token has been revoked');
    if (stored.isExpired())
      throw new UnauthorizedException('Refresh token has expired');

    const isMatch = await this.bcryptService.compare(
      input.refreshToken,
      stored.tokenHash,
    );
    if (!isMatch) throw new UnauthorizedException('Refresh token mismatch');

    const accessToken: string = await this.tokenService.generateAccessToken({
      sub: stored.userId,
    });
    const newRefreshToken: string =
      await this.tokenService.generateRefreshToken({ sub: stored.userId });

    const newHash = await this.bcryptService.hash(newRefreshToken);
    await this.refreshTokenRepo.revokeById(stored.id);
    await this.refreshTokenRepo.save(
      new RefreshToken(
        crypto.randomUUID(),
        stored.userId,
        newHash,
        new Date(Date.now() + this.refreshTokenTTLSeconds * 1000),
        null,
        new Date(),
      ),
    );

    return {
      accessToken,
      refreshToken: newRefreshToken,
      expiresIn: this.accessTokenTTLSeconds,
    };
  }
}

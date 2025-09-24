import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { MagicLinkTokenRepository } from '@/infrastructure/db/typeorm/magic-link-token.repository';
import { JwtTokenService } from '@/infrastructure/security/jwt.service';
import { hashToken } from '@/shared/utils/magic-token.util';
import { UserRepositoryImpl } from '@/infrastructure/db/typeorm/user.repository.impl';
import { UserDataDto } from '@/core/application/dto/user/user.dto';
import { TokensDto } from '@/core/application/dto/security/token/tokens.dto';

@Injectable()
export class VerifyMagicLinkUseCase {
  constructor(
    private readonly repo: MagicLinkTokenRepository,
    @Inject('IUserRepository')
    private readonly userRepo: UserRepositoryImpl,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async execute(email: string, token: string) {
    const candidates = await this.repo.findValidByEmail(email);
    if (!candidates || candidates.length === 0)
      throw new BadRequestException('Invalid or expired token');

    const tokenHash = hashToken(token);
    const now = new Date();

    const match = candidates.find(
      (c) => c.tokenHash === tokenHash && !c.used && c.expiresAt > now,
    );
    if (!match) throw new BadRequestException('Invalid or expired token');

    await this.repo.markUsed(match.id);

    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new BadRequestException('User not found');

    const payload = { sub: email, email, role: 'user' };

    const accessToken = await this.jwtTokenService.generateAccessToken(payload);
    const refreshToken =
      await this.jwtTokenService.generateRefreshToken(payload);

    return new UserDataDto(user, new TokensDto(accessToken, refreshToken));
  }
}

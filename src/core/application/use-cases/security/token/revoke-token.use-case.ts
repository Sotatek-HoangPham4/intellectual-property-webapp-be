import {
  RevokeTokenRequestDto,
  RevokeTokenResponseDto,
} from '@/core/application/dto/security/token/revoke-token.dto';
import { RefreshTokenRepository } from '@/core/domain/repositories/refresh-token.repository';
import { TokenService } from '@/core/domain/services/token.service';

export class RevokeTokenUseCase {
  constructor(
    private readonly refreshTokenRepo: RefreshTokenRepository,
    private readonly tokenService: TokenService,
  ) {}

  async execute(
    userId: string,
    input: RevokeTokenRequestDto,
  ): Promise<RevokeTokenResponseDto> {
    let revokedCount = 0;

    if (input.all) {
      revokedCount = await this.refreshTokenRepo.revokeAllByUserId(userId);
    } else if (input.refreshToken) {
      const hash = this.tokenService.hashToken(input.refreshToken);
      const token = await this.refreshTokenRepo.findByTokenHash(hash);
      if (token && token.userId === userId) {
        await this.refreshTokenRepo.revokeById(token.id);
        revokedCount = 1;
      }
    }

    return { success: revokedCount > 0, revokedCount };
  }
}

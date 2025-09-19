import { Injectable } from '@nestjs/common';
import {
  RefreshTokenRequestDto,
  RefreshTokenResponseDto,
} from '../../../../core/application/dto/auth/refresh.dto';
import {
  RevokeTokenRequestDto,
  RevokeTokenResponseDto,
} from '../../../../core/application/dto/auth/tokens.dto';
import { RefreshTokenUseCase } from '@/core/application/use-cases/security/token/refresh-token.use-case';
import { RevokeTokenUseCase } from '@/core/application/use-cases/security/token/revoke-token.use-case';

@Injectable()
export class TokenServiceAdapter {
  constructor(
    private readonly refreshUseCase: RefreshTokenUseCase,
    private readonly revokeUseCase: RevokeTokenUseCase,
  ) {}

  async refresh(dto: RefreshTokenRequestDto): Promise<RefreshTokenResponseDto> {
    return this.refreshUseCase.execute(dto);
  }

  async revoke(
    userId: string,
    dto: RevokeTokenRequestDto,
  ): Promise<RevokeTokenResponseDto> {
    console.log('ID :', userId);
    return this.revokeUseCase.execute(userId, dto);
  }
}

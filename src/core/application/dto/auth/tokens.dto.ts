import { ApiProperty } from '@nestjs/swagger';

export class TokensDto {
  @ApiProperty({ description: 'JWT Access Token' })
  accessToken!: string;

  @ApiProperty({ description: 'JWT Refresh Token' })
  refreshToken!: string;

  constructor(accessToken?: string, refreshToken?: string) {
    if (accessToken) this.accessToken = accessToken;
    if (refreshToken) this.refreshToken = refreshToken;
  }
}

export class RevokeTokenRequestDto {
  @ApiProperty({ description: 'The refresh token to revoke', required: false })
  refreshToken?: string;

  @ApiProperty({
    description: 'Revoke all tokens for this user',
    required: false,
  })
  all?: boolean;
}

export class RevokeTokenResponseDto {
  @ApiProperty({ description: 'Operation success status' })
  success!: boolean;

  @ApiProperty({ description: 'Number of revoked tokens' })
  revokedCount!: number;

  constructor(success: boolean, revokedCount: number) {
    this.success = success;
    this.revokedCount = revokedCount;
  }
}

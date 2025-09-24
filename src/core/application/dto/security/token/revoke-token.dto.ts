import { ApiProperty } from '@nestjs/swagger';

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

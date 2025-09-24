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

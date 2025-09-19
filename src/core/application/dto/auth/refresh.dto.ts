import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenRequestDto {
  @IsNotEmpty()
  @IsString()
  refreshToken!: string;
}

export class RefreshTokenResponseDto {
  accessToken!: string;
  refreshToken?: string;
  expiresIn!: number;
}

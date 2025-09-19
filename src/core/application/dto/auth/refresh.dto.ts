import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshDto {
  @ApiProperty({
    example: 'e8f6b5f3-9c43-4baf-9a1f-7d9a2a0b0f2b',
    description: 'UUID of the user requesting new tokens',
  })
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Valid refresh token issued during login',
  })
  @IsNotEmpty()
  refreshToken: string;
}

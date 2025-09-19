import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ example: 'token-from-email' })
  @IsNotEmpty()
  token: string;

  @ApiProperty({ example: 'NewStrongPassword123' })
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
}

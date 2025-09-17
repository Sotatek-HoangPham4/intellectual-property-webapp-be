import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterReqDto {
  @ApiProperty({
    example: 'Alice',
    description: 'The name of the new user',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'alice@example.com',
    description: 'Valid email address of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Password with a minimum of 6 characters',
    minLength: 6,
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class UserInfoDto {
  @ApiProperty({ example: 'd10fff8c-fa0f-47b1-9031-8d2e7e0ebbbf' })
  id: string;

  @ApiProperty({ example: 'Admin' })
  name: string;

  @ApiProperty({ example: 'admin@example.com' })
  email: string;

  @ApiProperty({ example: 'local', description: 'Authentication provider' })
  provider: string;

  @ApiProperty({
    example: 'd10fff8c-fa0f-47b1-9031-8d2e7e0ebbbf',
    description: 'Provider-specific ID',
  })
  providerId: string | null;

  @ApiProperty({
    example: null,
    description: 'Avatar URL (optional)',
    nullable: true,
    required: false,
  })
  avatar?: string | null;
}

export class RegisterResDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token',
  })
  accessToken: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT refresh token',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'Registered user information',
    type: () => UserInfoDto,
  })
  user: UserInfoDto;
}

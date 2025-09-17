import { ApiProperty } from '@nestjs/swagger';

export class AuthUser {
  @ApiProperty({ example: '8be63d01-8e51-428c-957d-59e72fa79b0c' })
  id: string;

  @ApiProperty({ example: 'Alice' })
  name: string;

  @ApiProperty({ example: 'alice@example.com' })
  email: string;
}

export class AuthResponseDto {
  @ApiProperty({
    example: 'google',
    description: 'OAuth provider (google, facebook, etc.)',
  })
  provider: string;

  @ApiProperty({
    example: '1234567890',
    description: 'Provider unique user ID',
  })
  providerId: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email address',
  })
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  name: string;

  @ApiProperty({
    example: 'https://lh3.googleusercontent.com/a-/AOh14Gg9example=s96-c',
    description: 'Profile picture URL',
  })
  avatar?: string | null;

  @ApiProperty({
    example: 'ya29.A0ARrdaM...',
    description: 'Google OAuth access token',
  })
  accessToken: string;
}

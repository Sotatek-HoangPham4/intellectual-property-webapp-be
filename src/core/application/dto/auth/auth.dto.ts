import { ApiProperty } from '@nestjs/swagger';
import { UserDataDto } from '../user/user.dto';

export class AuthResponseDto {
  @ApiProperty({
    example: 'a7cd930d-3efd-4174-ba7d-c48eee78c150',
    description: 'Provider unique user ID',
  })
  id?: string;

  @ApiProperty({
    example: 'google',
    description: 'OAuth provider (google, facebook, etc.)',
  })
  provider?: string;

  @ApiProperty({
    example: '1234567890',
    description: 'Provider unique user ID',
  })
  providerId?: string;

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
  accessToken?: string;

  @ApiProperty({
    example: 'ya29.A0ARrdaM...',
    description: 'Google OAuth access token',
  })
  refreshToken?: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { TokensDto } from '../auth/tokens.dto';

export class UserDataDto {
  @ApiProperty({ example: 'd10fff8c-fa0f-47b1-9031-8d2e7e0ebbbf' })
  id: string;

  @ApiProperty({ example: 'Admin' })
  name: string;

  @ApiProperty({ example: 'admin@example.com' })
  email: string;

  @ApiProperty({
    example: null,
    description: 'Avatar URL (optional)',
    nullable: true,
    required: false,
  })
  avatar?: string | null;

  @ApiProperty({ example: 'local', description: 'Authentication provider' })
  provider: string;

  @ApiProperty({
    example: 'd10fff8c-fa0f-47b1-9031-8d2e7e0ebbbf',
    description: 'Provider-specific ID',
  })
  providerId: string | null;

  @ApiProperty({ type: TokensDto })
  tokens: TokensDto;

  constructor(user: any, tokens: TokensDto) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.avatar = user.avatar ?? null;
    this.provider = user.provider ?? 'local';
    this.providerId = user.providerId ?? user.id;
    this.tokens = tokens;
  }
}

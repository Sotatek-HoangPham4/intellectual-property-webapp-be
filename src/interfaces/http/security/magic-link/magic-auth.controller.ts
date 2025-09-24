import { RequestMagicLinkDto } from '@/core/application/dto/security/magic-link/request-magic-link.dto';
import { VerifyMagicLinkDto } from '@/core/application/dto/security/magic-link/verify-magic-link.dto';
import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { MagicAuthService } from './magic-auth.service';

@Controller('auth/magic-link')
export class MagicAuthController {
  constructor(private readonly magicService: MagicAuthService) {}

  @Post('send-me')
  @HttpCode(HttpStatus.OK)
  async request(@Body() dto: RequestMagicLinkDto, @Req() req: any) {
    const origin = req.headers['origin'] || req.headers['referer'];
    await this.magicService.requestMagicLink(dto.email, origin);
    return { message: 'If the email exists, a magic link has been sent.' };
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verify(@Body() dto: VerifyMagicLinkDto) {
    const tokens = await this.magicService.verifyMagicLink(
      dto.email,
      dto.token,
    );
    return tokens;
  }
}

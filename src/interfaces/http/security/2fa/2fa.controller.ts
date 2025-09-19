import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { TwoFactorAuthService } from './2fa.service';
import { Verify2FADto } from '../../../../core/application/dto/security/2fa/verify-2fa.dto';

@Controller('auth/2fa')
@UseGuards(JwtAuthGuard)
export class TwoFactorAuthController {
  constructor(private readonly twoFAService: TwoFactorAuthService) {}

  @Post('setup')
  async setup2FA(@Req() req) {
    const userId = req.user.id;
    return this.twoFAService.generate2FASetup(userId);
  }

  @Post('verify')
  async verify2FA(@Req() req, @Body() dto: Verify2FADto) {
    const userId = req.user.id;
    return this.twoFAService.verify2FA(userId, dto.code);
  }

  @Post('disable')
  async disable2FA(@Req() req) {
    const userId = req.user.id;
    return this.twoFAService.disable2FA(userId);
  }
}

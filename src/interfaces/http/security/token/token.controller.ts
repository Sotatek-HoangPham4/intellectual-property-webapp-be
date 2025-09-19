import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { TokenServiceAdapter } from './token.service';
import { RefreshTokenRequestDto } from '../../../../core/application/dto/auth/refresh.dto';
import { RevokeTokenRequestDto } from '../../../../core/application/dto/auth/tokens.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('auth/token')
export class TokenController {
  constructor(private readonly tokenService: TokenServiceAdapter) {}

  @Post('refresh')
  async refresh(@Body() dto: RefreshTokenRequestDto) {
    return this.tokenService.refresh(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('revoke')
  async revoke(@Req() req: any, @Body() dto: RevokeTokenRequestDto) {
    console.log('ID :', req.user?.id);
    return this.tokenService.revoke(req.user.id, dto);
  }
}

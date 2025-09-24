import { Controller, Post, Body } from '@nestjs/common';
import { WebAuthService } from './webauth.service';

@Controller('auth/webauthn')
export class WebAuthController {
  constructor(private readonly webAuthnService: WebAuthService) {}

  @Post('login/options')
  async loginOptions(@Body('email') email: string) {
    return this.webAuthnService.generateLoginOptions(email);
  }

  @Post('login/verify')
  async loginVerify(@Body() body: any) {
    return this.webAuthnService.verifyLoginResponse(body.email, body);
  }
}

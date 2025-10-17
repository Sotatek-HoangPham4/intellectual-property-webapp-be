import {
  Body,
  Controller,
  Post,
  UseGuards,
  Req,
  Get,
  HttpStatus,
  Patch,
  Res,
  HttpCode,
  UnauthorizedException,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from '@/interfaces/http/auth/auth.service';
import {
  RegisterReqDto,
  RegisterResDto,
} from '../../../core/application/dto/auth/register.dto';
import { LoginDto } from '../../../core/application/dto/auth/login.dto';
import { JwtAuthGuard } from '@/interfaces/http/auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RolesGuard } from '@/interfaces/http/auth/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { TokensDto } from '../../../core/application/dto/security/token/tokens.dto';
import { UserDataDto } from '../../../core/application/dto/user/user.dto';
import { VerifyIdentityDto } from '@/core/application/dto/auth/verify-identity.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('verify-identity')
  @HttpCode(HttpStatus.OK)
  async verifyIdentity(@Req() req, @Body() dto: VerifyIdentityDto) {
    const userId = req.user.id;

    switch (dto.method) {
      case 'password':
        await this.authService.verifyPassword(userId, dto.password!);
        break;

      // case 'email-otp':
      //   await this.authService.verifyEmailOTP(userId, dto.code);
      //   break;

      // case 'phone-otp':
      //   await this.authService.verifyPhoneOTP(userId, dto.code);
      //   break;

      // case 'totp':
      //   await this.authService.verifyTOTP(userId, dto.code);
      //   break;

      default:
        throw new UnauthorizedException('Invalid verification method');
    }

    return { message: 'Identity verified successfully', method: dto.method };
  }

  @Post('register')
  @ApiBody({ type: RegisterReqDto })
  @ApiCreatedResponse({ type: RegisterResDto })
  async register(@Body() dto: RegisterReqDto) {
    return this.authService.register(dto.email, dto.password);
  }

  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: UserDataDto })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response, // 👉 Express Response
  ) {
    const { accessToken, refreshToken, user } = await this.authService.login(
      dto.email,
      dto.password,
    );

    // ✅ set HttpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    return new UserDataDto(user, new TokensDto(accessToken, refreshToken));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('logout')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'User successfully logout' })
  async logout(@Req() req: any) {
    await this.authService.logout(req.user.id);
    return { message: 'User logout successfully' };
  }

  // Google Login
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {
    return { message: 'Redirecting to Google...' };
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleRedirect(@Req() req) {
    return this.authService.socialLogin(req.user);
  }

  // Facebook Login
  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin() {
    return { message: 'Redirecting to Facebook...' };
  }

  @Get('facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  async facebookRedirect(@Req() req) {
    return this.authService.socialLogin(req.user);
  }

  @Post('register/otp')
  async sendOtp(@Body('email') email: string) {
    return this.authService.sendRegistrationOtp(email);
  }

  @Post('register/otp/verify')
  async verifyAndRegister(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('code') code: string,
  ) {
    return this.authService.verifyOtpAndRegister(email, password, code);
  }
}

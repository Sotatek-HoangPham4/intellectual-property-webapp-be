import { Body, Controller, Post, UseGuards, Req, Get } from '@nestjs/common';
import { AuthService } from '@/interfaces/http/auth/auth.service';
import { RegisterReqDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { JwtAuthGuard } from '@/interfaces/http/auth/jwt-auth.guard';
import {
  ApiTags,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthResponseDto } from './dto/auth.dto';
import { RolesGuard } from '@/common/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiBody({ type: RegisterReqDto })
  @ApiCreatedResponse({
    description: 'User successfully registered',
    schema: {
      example: {
        status: 'SUCCESS',
        message: 'Operation completed successfully',
        data: {
          provider: 'local',
          providerId: 'uuid-user-id',
          email: 'admin@example.com',
          name: 'Admin',
          avatar: null,
          accessToken: 'jwt-access-token',
          refreshToken: 'jwt-refresh-token',
        },
      },
    },
  })
  async register(@Body() dto: RegisterReqDto) {
    const { accessToken, refreshToken, user } = await this.authService.register(
      dto.name,
      dto.email,
      dto.password,
    );

    return {
      status: 'SUCCESS',
      message: 'Operation completed successfully',
      data: {
        provider: 'local',
        providerId: user.id,
        email: user.email,
        name: user.name,
        avatar: null,
        accessToken,
        refreshToken,
      },
    };
  }

  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    description: 'User successfully logged in',
    type: AuthResponseDto,
  })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Post('refresh')
  @ApiBody({ type: RefreshDto })
  @ApiOkResponse({
    description: 'User successfully refreshed',
    type: AuthResponseDto,
  })
  async refresh(@Body() dto: RefreshDto) {
    return this.authService.refreshTokens(dto.userId, dto.refreshToken);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('logout')
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'User successfully logout',
    schema: {
      example: { success: true },
    },
  })
  async logout(@Req() req: any) {
    const userId = req.user.userId;
    await this.authService.logout(userId);
    return { success: true };
  }

  // Google Login
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {
    return { message: 'Redirecting to Google...' };
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  @ApiOkResponse({ type: AuthResponseDto })
  async googleRedirect(@Req() req): Promise<AuthResponseDto> {
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
}

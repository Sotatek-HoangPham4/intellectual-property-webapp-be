import {
  Body,
  Controller,
  Post,
  UseGuards,
  Req,
  Get,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from '@/interfaces/http/auth/auth.service';
import { RegisterReqDto, RegisterResDto } from './dto/register.dto';
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
import { ApiResponseDto } from '../common/dto/api-response.dto';
import { TokensDto } from './dto/tokens.dto';
import { UserDataDto } from '../user/dto/user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiBody({ type: RegisterReqDto })
  @ApiCreatedResponse({ type: RegisterResDto })
  async register(@Body() dto: RegisterReqDto): Promise<RegisterResDto> {
    try {
      return await this.authService.register(dto.name, dto.email, dto.password);
    } catch (err) {
      return new RegisterResDto(
        null,
        HttpStatus.BAD_REQUEST,
        err.message || 'Registration failed',
      );
    }
  }
  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: RegisterResDto })
  async login(@Body() dto: LoginDto): Promise<RegisterResDto> {
    try {
      const { accessToken, refreshToken, user } = await this.authService.login(
        dto.email,
        dto.password,
      );

      const userInfo = new UserDataDto(
        user,
        new TokensDto(accessToken, refreshToken),
      );

      return new RegisterResDto(
        userInfo,
        HttpStatus.OK,
        'User successfully logged in',
      );
    } catch (err) {
      return new RegisterResDto(
        null,
        HttpStatus.BAD_REQUEST,
        err.message || 'Login failed',
      );
    }
  }

  // @Post('login')
  // @ApiBody({ type: LoginDto })
  // @ApiCreatedResponse({ type: LoginDto })
  // async login(@Body() dto: LoginDto): Promise<ApiResponseDto<AuthResponseDto>> {
  //   try {
  //     const { accessToken, refreshToken, user } = await this.authService.login(
  //       dto.email,
  //       dto.password,
  //     );

  //     return {
  //       status: HttpStatus.OK,
  //       message: 'User successfully logged in',
  //       data: {
  //         provider: user.provider ?? 'local',
  //         providerId: user.providerId ?? user.id,
  //         email: user.email,
  //         name: user.name,
  //         avatar: user.avatar ?? null,
  //         accessToken,
  //         refreshToken,
  //       },
  //     };
  //   } catch (err) {
  //     return {
  //       status: HttpStatus.BAD_REQUEST,
  //       message: err.message || 'Login failed',
  //       data: undefined,
  //     };
  //   }
  // }

  // @Post('refresh')
  // @ApiBody({ type: RefreshDto })
  // @ApiOkResponse({ type: ApiResponseDto<AuthResponseDto> })
  // async refresh(
  //   @Body() dto: RefreshDto,
  // ): Promise<ApiResponseDto<AuthResponseDto>> {
  //   try {
  //     const tokens = await this.authService.refreshTokens(
  //       dto.userId,
  //       dto.refreshToken,
  //     );
  //     const user = await this.authService.getUserById(dto.userId);

  //     return {
  //       status: HttpStatus.OK,
  //       message: 'User successfully refreshed',
  //       data: {
  //         provider: user.provider ?? 'local',
  //         providerId: user.providerId ?? user.id,
  //         email: user.email,
  //         name: user.name,
  //         avatar: user.avatar ?? undefined,
  //         accessToken: tokens.accessToken,
  //         refreshToken: tokens.refreshToken,
  //       },
  //     };
  //   } catch (err) {
  //     return {
  //       status: HttpStatus.BAD_REQUEST,
  //       message: err.message || 'Refresh failed',
  //       data: undefined,
  //     };
  //   }
  // }

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

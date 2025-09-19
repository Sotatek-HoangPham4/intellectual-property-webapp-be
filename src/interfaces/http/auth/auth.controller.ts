import {
  Body,
  Controller,
  Post,
  UseGuards,
  Req,
  Get,
  HttpStatus,
  Patch,
} from '@nestjs/common';
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
import { TokensDto } from '../../../core/application/dto/auth/tokens.dto';
import { UserDataDto } from '../../../core/application/dto/user/user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiBody({ type: RegisterReqDto })
  @ApiCreatedResponse({ type: RegisterResDto })
  async register(@Body() dto: RegisterReqDto) {
    return this.authService.register(dto.name, dto.email, dto.password);
  }

  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: RegisterResDto })
  async login(@Body() dto: LoginDto) {
    const { accessToken, refreshToken, user } = await this.authService.login(
      dto.email,
      dto.password,
    );

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
}

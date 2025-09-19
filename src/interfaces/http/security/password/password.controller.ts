import { Body, Controller, Patch, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiBody,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PasswordService } from './password.service';
import { ForgotPasswordDto } from '../../../../core/application/dto/security/password/forgot-password.dto';
import { ResetPasswordDto } from '../../../../core/application/dto/security/password/reset-password.dto';
import { ChangePasswordDto } from '../../../../core/application/dto/security/password/change-password.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Password Management')
@Controller('auth/password')
export class PasswordController {
  constructor(private readonly passwordService: PasswordService) {}

  @Post('forgot')
  @ApiBody({ type: ForgotPasswordDto })
  @ApiOkResponse({ description: 'Password reset email sent' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.passwordService.forgotPassword(dto.email);
    return { message: 'Password reset email sent.' };
  }

  @Post('reset')
  @ApiBody({ type: ResetPasswordDto })
  @ApiOkResponse({ description: 'Password successfully reset' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.passwordService.resetPassword(dto.token, dto.newPassword);
    return { message: 'Password successfully reset.' };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change')
  @ApiBearerAuth()
  @ApiBody({ type: ChangePasswordDto })
  @ApiOkResponse({ description: 'Password successfully changed' })
  async changePassword(@Req() req, @Body() dto: ChangePasswordDto) {
    await this.passwordService.changePassword(
      req.user.id,
      dto.currentPassword,
      dto.newPassword,
    );
    return { message: 'Password successfully changed.' };
  }
}

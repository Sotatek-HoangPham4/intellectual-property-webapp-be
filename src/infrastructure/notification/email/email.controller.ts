import {
  Controller,
  Patch,
  Body,
  Req,
  HttpException,
  HttpStatus,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { EmailService } from './email.service';
import type { Request } from 'express';
import { UserService } from '@/interfaces/http/user/user.service';
import { JwtAuthGuard } from '@/interfaces/http/auth/guards/jwt-auth.guard';

@Controller('email')
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    private readonly userService: UserService,
  ) {}

  // Step 1: Send a verification code to the current email
  @Patch('change')
  async changeEmail(
    @Req() req: Request,
    @Body() body: { currentEmail: string },
  ) {
    const { currentEmail } = body;
    // Send verification code to current email
    await this.emailService.sendEmailVerificationCode(currentEmail);
    return {
      message: 'A verification code has been sent to your current email.',
    };
  }

  // Step 2: Verify the code for the current email
  @Patch('verify-current-email')
  async verifyCurrentEmail(@Req() req: Request, @Body() body: any) {
    const { currentEmail, verificationCode } = body;

    try {
      // Step 1: Verify the current email
      const isVerified = await this.emailService.verifyCurrentEmail(
        currentEmail,
        verificationCode,
      );

      console.log('isVerified :', isVerified);

      // Step 2: If verified, return a success message
      if (isVerified) {
        return { message: 'Current email verified, now enter new email.' };
      }
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Step 3: Send a verification code to the new email
  @Patch('verify-new-email')
  async verifyNewEmail(
    @Req() req: Request,
    @Body() body: { newEmail: string },
  ) {
    const { newEmail } = body;
    // Send verification code to new email
    await this.emailService.sendNewEmailVerificationCode(newEmail);
    return { message: 'A verification code has been sent to your new email.' };
  }

  // Step 4: Verify the new email
  @UseGuards(JwtAuthGuard)
  @Patch('confirm-new-email')
  async confirmNewEmail(
    @Req() req: any, // Ensure req has user property
    @Body() body: { newEmail: string; verificationCode: string },
  ) {
    console.log('User:', req.user); // Check if req.user is populated
    const userId = req.user.id; // This line might fail if req.user is not set
    const { newEmail, verificationCode } = body;

    try {
      // Verify code first
      const res = await this.emailService.verifyNewEmail(
        newEmail,
        verificationCode,
      );
      console.log('res:', res);

      // Update email in DB
      await this.userService.updateEmail(userId, newEmail);
      console.log('Email updated successfully!');

      return { message: 'New email verified and updated successfully!' };
    } catch (error) {
      console.error(
        'Error during email verification or update:',
        error.message,
      );
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

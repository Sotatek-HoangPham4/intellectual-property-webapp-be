import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ResendClient } from './resend.client';
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import * as crypto from 'crypto';

@Injectable()
export class EmailService {
  constructor(private readonly resendClient: ResendClient) {}

  private readonly verificationCodes = new Map<string, string>();

  // Helper function to generate a verification code
  private generateVerificationCode(): string {
    return crypto.randomBytes(3).toString('hex'); // Generate a 6-digit code
  }

  async sendTemplateEmail(
    to: string,
    subject: string,
    templateName: string,
    context: any,
  ) {
    const templatePath = path.join(
      __dirname,
      'templates',
      `${templateName}.hbs`,
    );
    console.log(templatePath);
    const source = fs.readFileSync(templatePath, 'utf8');
    const compiled = Handlebars.compile(source);
    const html = compiled(context);
    return this.resendClient.sendEmail(to, subject, html);
  }

  async sendWelcomeEmail(to: string, name: string) {
    return this.sendTemplateEmail(
      'hoang.pham4@sotatek.com',
      'Welcome to Happy App!',
      'welcome.template',
      { name },
    );
  }

  async sendPasswordReset(to: string, resetLink: string) {
    console.log(to, resetLink);
    return this.sendTemplateEmail(
      'hoang.pham4@sotatek.com',
      'Reset your password',
      'password-reset.template',
      { resetLink },
    );
  }

  async sendMagicLink(to: string, link: string) {
    return this.sendTemplateEmail(
      to,
      'Your Magic Login Link',
      'magic-link.template',
      { link },
    );
  }

  // Send email verification code to the current email
  async sendEmailVerificationCode(currentEmail: string) {
    const verificationCode = this.generateVerificationCode();
    // Store this code in the database or cache for later comparison
    // For demonstration, this could be stored in-memory or session
    // Store it with the key: `email-change-${currentEmail}`
    console.log('Verification Code:', verificationCode); // For testing, store or log this
    this.verificationCodes.set(currentEmail, verificationCode);
    // return this.sendTemplateEmail(
    //   currentEmail,
    //   'Email Change Verification Code',
    //   'email-verification.template',
    //   { verificationCode },
    // );

    try {
      const result = this.sendTemplateEmail(
        currentEmail,
        'Email Change Verification Code',
        'email-verification.template',
        { verificationCode },
      );
      console.log(result);
    } catch (error) {
      console.error('Error while sending verification email:', error);
      throw new Error('Failed to send email');
    }
  }

  // Send email verification code to the new email
  async sendNewEmailVerificationCode(newEmail: string) {
    const verificationCode = this.generateVerificationCode();
    // Store this code in the database or cache for later comparison
    console.log('Verification Code for new email:', verificationCode); // For testing
    this.verificationCodes.set(newEmail, verificationCode);
    return this.sendTemplateEmail(
      newEmail,
      'New Email Verification Code',
      'email-verification.template',
      { verificationCode },
    );
  }

  async verifyCurrentEmail(
    currentEmail: string,
    verificationCode: string,
  ): Promise<boolean> {
    const storedCode = this.verificationCodes.get(currentEmail);

    console.log('storedCode :', storedCode);

    if (!storedCode) {
      throw new HttpException(
        'Verification code not sent or expired',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (storedCode !== verificationCode) {
      throw new HttpException(
        'Invalid verification code',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Once verified, you can delete the code or mark it as used
    this.verificationCodes.delete(currentEmail);
    return true;
  }

  async verifyNewEmail(
    newEmail: string,
    verificationCode: string,
  ): Promise<boolean> {
    console.log('Verifying code for email:', newEmail);
    const storedCode = this.verificationCodes.get(newEmail);

    if (!storedCode) {
      console.error(`No verification code found for ${newEmail}`);
      throw new HttpException(
        'Verification code expired or not sent',
        HttpStatus.BAD_REQUEST,
      );
    }

    console.log('Stored code:', storedCode);
    console.log('Provided code:', verificationCode);

    if (storedCode !== verificationCode) {
      console.error(`Verification code mismatch for ${newEmail}`);
      throw new HttpException(
        'Invalid verification code',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Once verified, you can delete the code or mark it as used
    this.verificationCodes.delete(newEmail);
    console.log('Verification successful, code deleted for:', newEmail);
    return true;
  }
}

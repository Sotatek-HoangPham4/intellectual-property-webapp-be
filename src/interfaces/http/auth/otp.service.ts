import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { randomInt } from 'crypto';
import { EmailService } from '@/infrastructure/notification/email/email.service';
import type { IUserRepository } from '@/core/domain/repositories/user.repository';

@Injectable()
export class OtpService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly emailService: EmailService,
    @Inject('IUserRepository')
    private readonly userRepo: IUserRepository,
  ) {}

  async sendOtp(email: string) {
    const exists = await this.userRepo.findByEmail(email);
    if (exists) throw new BadRequestException('Email already registered');

    const otpCode = randomInt(100000, 999999).toString();
    await this.cache.set(`code:${email}`, otpCode, 1000 * 60 * 5); // 5 phút

    await this.emailService.sendTemplateEmail(
      email,
      'Your Happy App verification code',
      'otp.template',
      { code: otpCode },
    );

    return { message: 'Verification code has sent to your email' };
  }

  async verifyOtp(email: string, code: string): Promise<boolean> {
    const storedOtp = await this.cache.get<string>(`code:${email}`);
    console.log(storedOtp);
    if (!storedOtp)
      throw new BadRequestException('Verification code expired or not found');
    if (storedOtp !== code)
      throw new BadRequestException('Invalid verification code');

    await this.cache.del(`code:${email}`);
    return true;
  }
}

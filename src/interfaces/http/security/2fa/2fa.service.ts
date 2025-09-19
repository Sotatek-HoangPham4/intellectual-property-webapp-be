import {
  Injectable,
  BadRequestException,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import type { IUserRepository } from '@/core/domain/repositories/user.repository';

@Injectable()
export class TwoFactorAuthService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepo: IUserRepository,
  ) {}

  async generate2FASetup(userId: string) {
    const secret = speakeasy.generateSecret({
      name: 'Testing App',
      length: 32,
    });

    const token = speakeasy.totp({
      secret: secret.base32,
      encoding: 'base32',
    });
    console.log('Generated dev token: ', token);

    const user = await this.userRepo.findById(userId);
    if (user) {
      user.twoFactorSecret = secret.base32;
      await this.userRepo.update(user);
    }

    const qrCode = await QRCode.toDataURL(secret.otpauth_url!);

    return {
      qrCode,
      secret: secret.base32,
    };
  }

  async verify2FA(userId: string, code: string) {
    const user = await this.userRepo.findById(userId);
    if (!user?.twoFactorSecret) {
      throw new BadRequestException('2FA not set up for this user');
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: code,
      window: 1,
    });

    if (!verified) {
      throw new BadRequestException('Invalid 2FA code');
    }

    user.isTwoFactorEnabled = true;
    await this.userRepo.update(user);

    return { isTwoFactorEnabled: true };
  }

  async disable2FA(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    user.isTwoFactorEnabled = false;
    user.twoFactorSecret = null;
    await this.userRepo.update(user);

    return { isTwoFactorEnabled: false };
  }
}

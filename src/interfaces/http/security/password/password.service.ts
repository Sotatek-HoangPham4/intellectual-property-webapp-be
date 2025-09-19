import {
  Injectable,
  UnauthorizedException,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { BcryptService } from '@/infrastructure/security/bcrypt.service';
import type { IUserRepository } from '@/core/domain/repositories/user.repository';
import { randomUUID } from 'crypto';
import { hashToken } from '@/shared/utils/hash-token';

@Injectable()
export class PasswordService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepo: IUserRepository,
    private readonly bcryptService: BcryptService,
  ) {}

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new NotFoundException('Email not registered');
    const resetToken = randomUUID();
    const hashedToken = hashToken(resetToken);
    await this.userRepo.setResetPasswordToken(user.id, hashedToken, 15);

    console.log(
      `Reset password link: https://yourapp.com/reset-password?token=${resetToken}`,
    );
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.userRepo.findByResetToken(token);
    if (!user) throw new BadRequestException('Invalid or expired token');

    const hashedPassword = await this.bcryptService.hash(newPassword);
    await this.userRepo.updatePassword(user.id, hashedPassword);
    await this.userRepo.clearResetToken(user.id);
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const matches = await this.bcryptService.compare(
      currentPassword,
      user.password!,
    );
    if (!matches)
      throw new UnauthorizedException('Current password is incorrect');

    const hashedPassword = await this.bcryptService.hash(newPassword);
    await this.userRepo.updatePassword(userId, hashedPassword);
  }
}

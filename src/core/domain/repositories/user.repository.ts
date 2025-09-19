import type { UserEntity } from '../entities/user.entity';

export interface IUserRepository {
  create(user: UserEntity): Promise<UserEntity>;
  findById(id: string): Promise<UserEntity | null>;
  findAll(): Promise<UserEntity[]>;
  update(user: UserEntity): Promise<UserEntity>;
  delete(id: string): Promise<void>;
  findByEmail(email: string): Promise<UserEntity | null>;
  setCurrentRefreshToken(
    userId: string,
    hashedToken: string | null,
  ): Promise<void>;
  findByProvider(
    provider: string,
    providerId: string,
  ): Promise<UserEntity | null>;

  // ==== Add password management methods ====
  setResetPasswordToken(
    userId: string,
    hashedToken: string,
    expiresInMinutes: number,
  ): Promise<void>;
  findByResetToken(token: string): Promise<UserEntity | null>;
  updatePassword(userId: string, hashedPassword: string): Promise<void>;
  clearResetToken(userId: string): Promise<void>;
}

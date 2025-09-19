import { RefreshToken } from '../entities/refresh-token.entity';

export interface RefreshTokenRepository {
  findByUserId(userId: string): Promise<RefreshToken | null>;
  findByTokenHash(tokenHash: string): Promise<RefreshToken | null>;
  save(token: RefreshToken): Promise<void>;
  revokeById(id: string): Promise<void>;
  revokeAllByUserId(userId: string): Promise<number>;
}

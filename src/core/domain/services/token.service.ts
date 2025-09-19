export interface TokenService {
  generateAccessToken(payload: Record<string, any>): Promise<string> | string;
  generateRefreshToken(payload: Record<string, any>): Promise<string> | string;
  verifyRefreshToken(
    token: string,
  ): Promise<Record<string, any> | null> | Record<string, any> | null;
  hashToken(token: string): string;
}

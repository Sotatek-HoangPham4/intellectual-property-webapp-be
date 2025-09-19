import { createHmac, randomUUID } from 'crypto';
const RESET_TOKEN_SECRET = process.env.RESET_TOKEN_SECRET || 'my-secret-key';

export function hashToken(token: string) {
  return createHmac('sha256', RESET_TOKEN_SECRET).update(token).digest('hex');
}

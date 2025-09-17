import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
  async hash(data: string, rounds = 10) {
    return bcrypt.hash(data, rounds);
  }

  async compare(data: string, hash: string) {
    return bcrypt.compare(data, hash);
  }
}

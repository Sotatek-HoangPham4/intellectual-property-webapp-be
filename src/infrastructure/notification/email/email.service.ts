import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  async sendMagicLink(email: string, link: string) {
    // TODO: replace with real provider
    console.log(`[EmailService] Send magic link to ${email}: ${link}`);
    // return success boolean
    return true;
  }
}

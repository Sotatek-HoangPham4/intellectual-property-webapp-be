import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ResendClient {
  private readonly resend: Resend;
  private readonly logger = new Logger(ResendClient.name);
  private readonly fromEmail: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('resend.apiKey');
    const from = this.configService.get<string>('resend.from');
    if (!from) {
      throw new Error('Missing resend.from configuration');
    }
    this.fromEmail = from;

    this.resend = new Resend(apiKey);
  }

  async sendEmail(to: string, subject: string, html: string) {
    to = 'hoang.pham4@sotatek.com';
    try {
      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        to,
        subject,
        html,
      });

      if (error) {
        this.logger.error(`Resend error: ${error.message}`);
        throw error;
      }

      this.logger.log(`Email sent successfully to ${to}`);
      return data;
    } catch (err) {
      this.logger.error(`Failed to send email to ${to}: ${err.message}`);
      throw err;
    }
  }
}

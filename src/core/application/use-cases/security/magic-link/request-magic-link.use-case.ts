import { Injectable, ForbiddenException, Logger } from '@nestjs/common';
import { MagicLinkTokenRepository } from '@/infrastructure/db/typeorm/magic-link-token.repository';

import { ConfigService } from '@nestjs/config';
import { EmailService } from '@/infrastructure/notification/email/email.service';
import { generateToken, hashToken } from '@/shared/utils/magic-token.util';

@Injectable()
export class RequestMagicLinkUseCase {
  private readonly logger = new Logger(RequestMagicLinkUseCase.name);
  private readonly requestMap = new Map<
    string,
    { count: number; firstAt: number }
  >();

  constructor(
    private readonly repo: MagicLinkTokenRepository,
    private readonly emailService: EmailService,
    private readonly config: ConfigService,
  ) {}

  private getExpirationMinutes(): number {
    return Number(
      this.config.get<string>('MAGIC_LINK_EXPIRATION_MINUTES') ?? 15,
    );
  }

  private checkRateLimit(email: string) {
    const windowMs = Number(
      this.config.get<string>('MAGIC_LINK_RATE_WINDOW_MS') ?? 15 * 60 * 1000,
    );
    const maxRequests = Number(
      this.config.get<string>('MAGIC_LINK_MAX_REQUESTS') ?? 5,
    );
    const now = Date.now();

    const rec = this.requestMap.get(email);
    if (!rec) {
      this.requestMap.set(email, { count: 1, firstAt: now });
      return;
    }
    if (now - rec.firstAt > windowMs) {
      this.requestMap.set(email, { count: 1, firstAt: now });
      return;
    }
    rec.count++;
    if (rec.count > maxRequests)
      throw new ForbiddenException('Too many requests');
    this.requestMap.set(email, rec);
  }

  async execute(email: string, origin?: string) {
    this.checkRateLimit(email);

    const token = generateToken();

    const tokenHash = hashToken(token);
    const expiresAt = new Date(
      Date.now() + this.getExpirationMinutes() * 60 * 1000,
    );

    await this.repo.save({ email, tokenHash, expiresAt, used: false });

    const frontend =
      origin ??
      this.config.get<string>('MAGIC_LINK_FRONTEND_URL') ??
      'http://localhost:3000';
    const link = `${frontend}/auth/magic-verify?email=${encodeURIComponent(email)}&token=${token}`;

    await this.emailService.sendMagicLink(email, link);

    this.logger.debug(
      `Magic link created for ${email}, expires=${expiresAt.toISOString()}`,
    );
    return { message: 'Magic link sent' };
  }
}

import { RequestMagicLinkUseCase } from '@/core/application/use-cases/security/magic-link/request-magic-link.use-case';
import { VerifyMagicLinkUseCase } from '@/core/application/use-cases/security/magic-link/verify-magic-link.usecase';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MagicAuthService {
  constructor(
    private readonly requestMagicLinkUC: RequestMagicLinkUseCase,
    private readonly verifyMagicLinkUC: VerifyMagicLinkUseCase,
  ) {}

  async requestMagicLink(email: string, origin?: string) {
    return this.requestMagicLinkUC.execute(email, origin);
  }

  async verifyMagicLink(email: string, token: string) {
    return this.verifyMagicLinkUC.execute(email, token);
  }
}

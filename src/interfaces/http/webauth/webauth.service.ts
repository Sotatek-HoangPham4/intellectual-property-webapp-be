import { IUserRepository } from '@/core/domain/repositories/user.repository';
import { UserRepositoryImpl } from '@/infrastructure/db/typeorm/user.repository.impl';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';
import base64url from 'base64url';
import { SessionService } from '../security/session/session.service';

@Injectable()
export class WebAuthService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepo: UserRepositoryImpl,
  ) {}

  async generateLoginOptions(email: string) {
    const user = await this.userRepo.findByEmail(email);

    if (!user || !user.credentials?.length) {
      throw new BadRequestException('User not found or no credentials');
    }

    const options = await generateAuthenticationOptions({
      rpID: process.env.WEBAUTHN_RP_ID!,
      allowCredentials: user.credentials.map((cred) => ({
        id: base64url.encode(cred.credentialId),
        type: 'public-key',
      })),
      userVerification: 'preferred',
    });

    await this.userRepo.saveChallenge(user.id, options.challenge);

    return options;
  }

  async verifyLoginResponse(email: string, response: any) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new BadRequestException('User not found');

    const expectedChallenge = await this.userRepo.getChallenge(user.id);
    if (!expectedChallenge) throw new BadRequestException('Challenge expired');

    const credential = user.credentials.find(
      (c) => c.credentialId === response.id,
    );
    if (!credential) throw new BadRequestException('Credential not found');

    const verification = await verifyAuthenticationResponse({
      response,
      expectedChallenge,
      expectedOrigin: process.env.WEBAUTHN_ORIGIN!,
      expectedRPID: process.env.WEBAUTHN_RP_ID!,
      authenticator: {
        credentialID: base64url.toBuffer(credential.credentialId),
        credentialPublicKey: base64url.toBuffer(credential.credentialPublicKey),
        counter: credential.counter,
      },
    } as any);

    if (!verification.verified) {
      throw new BadRequestException('Invalid assertion');
    }

    await this.userRepo.updateCounter(
      user.id,
      credential.credentialId,
      verification.authenticationInfo.newCounter,
    );

    return {
      accessToken: 'signed-jwt-here',
      refreshToken: 'signed-refresh-token',
      user: { id: user.id, email: user.email },
    };
  }
}

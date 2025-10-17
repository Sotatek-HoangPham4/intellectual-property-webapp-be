import { CredentialOrmEntity } from '@/infrastructure/db/entities/credential.orm-entity';

export class UserEntity {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public password: string | null,
    public avatar: string | null = null,
    public provider: string | null = null,
    public providerId: string | null = null,
    public role: 'user' | 'admin' = 'user',
    public currentHashedRefreshToken: string | null = null,
    public resetPasswordToken: string | null = null,
    public resetTokenExpiresAt: Date | null = null,
    public twoFactorSecret: string | null = null,
    public isTwoFactorEnabled: boolean = false,
    public isHasPassword: boolean = false,
    public credentials: CredentialOrmEntity[] = [],
  ) {}
}

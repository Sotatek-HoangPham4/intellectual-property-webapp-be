import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CredentialOrmEntity } from './credential.orm-entity';
import { SessionOrmEntity } from './session.orm-entity';

@Entity('users')
export class UserOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  password: string | null;

  @Column({ type: 'varchar', nullable: true })
  avatar: string | null;

  @Column({ type: 'text', nullable: true })
  currentHashedRefreshToken: string | null;

  @Column({
    type: 'enum',
    enum: ['user', 'admin'],
    default: 'user',
  })
  @Column({ type: 'varchar', nullable: true })
  provider: string | null;

  @Column({ type: 'varchar', nullable: true })
  providerId: string | null;

  @Column({ type: 'varchar', default: 'user' })
  role: 'user' | 'admin';

  // --- Reset Password ---
  @Column({ type: 'varchar', nullable: true })
  resetPasswordToken: string | null;

  @Column({ type: 'timestamp', nullable: true })
  resetTokenExpiresAt: Date | null;

  // --- 2FA / MFA ---
  @Column({ type: 'varchar', nullable: true })
  twoFactorSecret: string | null;

  @Column({ type: 'boolean', default: false })
  isTwoFactorEnabled: boolean;

  // --- Credentials ---
  @OneToMany(() => CredentialOrmEntity, (cred) => cred.user, { cascade: true })
  credentials: CredentialOrmEntity[];

  // --- Sessions ---
  @OneToMany(() => SessionOrmEntity, (s) => s.user)
  sessions: SessionOrmEntity[];
}

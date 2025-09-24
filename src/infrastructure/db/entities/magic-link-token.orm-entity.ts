import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('magic_link_tokens')
export class MagicLinkTokenOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  email: string;

  @Column()
  tokenHash: string;

  @Column({ type: 'timestamptz' })
  expiresAt: Date;

  @Column({ default: false })
  used: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}

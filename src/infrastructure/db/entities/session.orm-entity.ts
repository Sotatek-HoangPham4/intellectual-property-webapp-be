import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { UserOrmEntity } from './user.orm-entity';

@Entity('sessions')
export class SessionOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => UserOrmEntity, (user) => user.sessions, {
    onDelete: 'CASCADE',
  })
  user: UserOrmEntity;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  ip: string | null;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  userAgent: string | null;

  @Column({ type: 'boolean', default: false })
  revoked: boolean;

  // Hash of refresh token (bcrypt/scrypt/sha256) — optional but recommended
  @Column({ type: 'varchar', length: 255, nullable: true })
  refreshTokenHash: string | null;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  // last activity time (you can update this on each request if needed)
  @Column({ type: 'timestamp with time zone', nullable: true })
  lastSeen: Date | null;
}

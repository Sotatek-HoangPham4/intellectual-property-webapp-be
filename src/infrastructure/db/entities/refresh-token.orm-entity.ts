import { Entity, Column, PrimaryColumn, Index } from 'typeorm';

@Entity({ name: 'refresh_tokens' })
export class RefreshTokenOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column('uuid')
  userId!: string;

  @Index()
  @Column('varchar', { length: 128 })
  tokenHash!: string;

  @Column('timestamp')
  expiresAt!: Date;

  @Column('timestamp', { nullable: true })
  revokedAt!: Date | null;

  @Column('timestamp')
  createdAt!: Date;
}

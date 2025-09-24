import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { UserOrmEntity } from './user.orm-entity';

@Entity('credentials')
export class CredentialOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'bytea' })
  credentialId: string;

  @Column({ type: 'bytea' })
  credentialPublicKey: string;

  @Column({ type: 'int' })
  counter: number;

  @ManyToOne(() => UserOrmEntity, (user) => user.credentials, {
    onDelete: 'CASCADE',
  })
  user: UserOrmEntity;
}

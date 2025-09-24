import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MagicLinkTokenOrmEntity } from '../entities/magic-link-token.orm-entity';
import { Repository } from 'typeorm';

@Injectable()
export class MagicLinkTokenRepository {
  constructor(
    @InjectRepository(MagicLinkTokenOrmEntity)
    private repo: Repository<MagicLinkTokenOrmEntity>,
  ) {}

  async save(entity: Partial<MagicLinkTokenOrmEntity>) {
    return this.repo.save(entity);
  }

  async findValidByEmail(email: string) {
    return this.repo.find({
      where: { email, used: false },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async markUsed(id: string) {
    await this.repo.update({ id }, { used: true });
  }

  async deleteOlderThan(date: Date) {
    await this.repo
      .createQueryBuilder()
      .delete()
      .from(MagicLinkTokenOrmEntity)
      .where('createdAt < :date', { date })
      .execute();
  }
}

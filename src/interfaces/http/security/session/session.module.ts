import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionOrmEntity } from '@/infrastructure/db/entities/session.orm-entity';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { SessionRepositoryImpl } from '@/infrastructure/db/typeorm/session.repository.impl';

@Module({
  imports: [TypeOrmModule.forFeature([SessionOrmEntity])],
  controllers: [SessionController],
  providers: [
    SessionService,
    {
      provide: 'SessionRepository',
      useClass: SessionRepositoryImpl,
    },
  ],
  exports: [SessionService, 'SessionRepository'],
})
export class SessionModule {}

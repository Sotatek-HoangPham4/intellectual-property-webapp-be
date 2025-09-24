import { Module } from '@nestjs/common';
import { WebAuthService } from './webauth.service';
import { WebAuthController } from './webauth.controller';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from '@/infrastructure/db/entities/user.orm-entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity]), UserModule],
  controllers: [WebAuthController],
  providers: [WebAuthService],
  exports: [WebAuthService],
})
export class WebAuthModule {}

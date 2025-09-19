import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '@/config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from '@/infrastructure/db/entities/user.orm-entity';
import { UserModule } from '@/interfaces/http/user/user.module';
import { AuthModule } from '@/interfaces/http/auth/auth.module';
import { SecurityModule } from './interfaces/http/security/security.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('db.host'),
        port: config.get('db.port'),
        username: config.get('db.user'),
        password: config.get('db.pass'),
        database: config.get('db.name'),
        entities: [UserOrmEntity],
        autoLoadEntities: true,
        synchronize: true, // dev only
      }),
    }),
    UserModule,
    AuthModule,
    SecurityModule,
  ],
})
export class AppModule {}

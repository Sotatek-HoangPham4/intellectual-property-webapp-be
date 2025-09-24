import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '@/config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from '@/infrastructure/db/entities/user.orm-entity';
import { UserModule } from '@/interfaces/http/user/user.module';
import { AuthModule } from '@/interfaces/http/auth/auth.module';
import { SecurityModule } from './interfaces/http/security/security.module';
import { WebAuthModule } from './interfaces/http/webauth/webauth.module';
import { CredentialOrmEntity } from './infrastructure/db/entities/credential.orm-entity';
import { SessionOrmEntity } from './infrastructure/db/entities/session.orm-entity';

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
        entities: [UserOrmEntity, CredentialOrmEntity, SessionOrmEntity],
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    UserModule,
    AuthModule,
    WebAuthModule,
    SecurityModule,
  ],
})
export class AppModule {}

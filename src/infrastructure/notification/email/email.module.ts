import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ResendClient } from './resend.client';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { UserModule } from '@/interfaces/http/user/user.module'; // Ensure the path is correct

@Module({
  imports: [ConfigModule, forwardRef(() => UserModule)],
  providers: [ResendClient, EmailService],
  controllers: [EmailController],
  exports: [EmailService],
})
export class EmailModule {}

import { IsEmail, IsString } from 'class-validator';

export class VerifyMagicLinkDto {
  @IsEmail()
  email: string;

  @IsString()
  token: string;
}

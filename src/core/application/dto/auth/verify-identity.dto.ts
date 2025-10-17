// verify-identity.dto.ts
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class VerifyIdentityDto {
  @IsIn(['password', 'email-otp', 'phone-otp', 'totp'])
  method: 'password' | 'email-otp' | 'phone-otp' | 'totp';

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  code?: string; // OTP or TOTP
}

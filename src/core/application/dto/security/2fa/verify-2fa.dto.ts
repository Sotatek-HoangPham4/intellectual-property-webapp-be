import { IsString, Length } from 'class-validator';

export class Verify2FADto {
  @IsString()
  @Length(6, 6, { message: '2FA code must be 6 digits' })
  code: string;
}

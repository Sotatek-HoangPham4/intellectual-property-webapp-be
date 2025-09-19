import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserDataDto } from '../user/user.dto';

export class LoginDto {
  @ApiProperty({
    example: 'alice@example.com',
    description: 'Email address of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'StrongPassword123',
    description: 'Password for the user account',
  })
  @IsNotEmpty()
  password: string;
}

export class LoginResDto {
  @ApiProperty({ example: 201 })
  status: number;

  @ApiProperty({ example: 'User successfully logined' })
  message: string;

  @ApiProperty({ type: UserDataDto })
  data?: UserDataDto | null;

  constructor(
    status = 201,
    message = 'User successfully logined',
    data?: UserDataDto | null,
  ) {
    this.status = status;
    this.message = message;
    this.data = data || null;
  }
}

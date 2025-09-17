import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TokensDto } from './tokens.dto';
import { UserDataDto } from '../../user/dto/user.dto';

export class RegisterReqDto {
  @ApiProperty({
    example: 'Alice',
    description: 'The name of the new user',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'alice@example.com',
    description: 'Valid email address of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Password with a minimum of 6 characters',
    minLength: 6,
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class RegisterResDto {
  @ApiProperty({ example: 201 })
  status: number;

  @ApiProperty({ example: 'User successfully registered' })
  message: string;

  @ApiProperty({ type: UserDataDto })
  data: UserDataDto | null;

  constructor(
    data: UserDataDto | null,
    status = 201,
    message = 'User successfully registered',
  ) {
    this.status = status;
    this.message = message;
    this.data = data;
  }
}

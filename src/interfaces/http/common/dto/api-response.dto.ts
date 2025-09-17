import { ApiProperty } from '@nestjs/swagger';
import { UserDataDto } from '../../user/dto/user.dto';

// export class ApiResponseDto<T> {
//   @ApiProperty({ example: 'SUCCESS' })
//   status: number;

//   @ApiProperty({ example: 'Operation completed successfully' })
//   message: string;

//   @ApiProperty({ required: false })
//   data?: T;
// }

export class ApiResponseDto {
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

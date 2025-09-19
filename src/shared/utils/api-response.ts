import { HttpStatus } from '@nestjs/common';

export interface ApiResponse<T = any> {
  status: number;
  message: string;
  data?: T;
}

export function success<T = any>(message: string, data?: T): ApiResponse<T> {
  return {
    status: HttpStatus.OK,
    message,
    ...(data !== undefined && { data }),
  };
}

export function error(
  message: string,
  status: number = HttpStatus.BAD_REQUEST,
): ApiResponse {
  return {
    status,
    message,
  };
}

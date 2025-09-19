import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();

      const res = exception.getResponse();
      message =
        typeof res === 'string'
          ? res
          : Array.isArray((res as any)?.message)
            ? (res as any).message.join(', ')
            : (res as any)?.message || exception.message;
    }

    response.status(status).json({
      status,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    return next.handle().pipe(
      map((data) => {
        const hasOnlyMessage =
          data &&
          typeof data === 'object' &&
          Object.keys(data).length === 1 &&
          'message' in data;

        return {
          status: response.statusCode,
          message: hasOnlyMessage ? data.message : data?.message || 'success',
          ...(hasOnlyMessage ? {} : { data }),
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}

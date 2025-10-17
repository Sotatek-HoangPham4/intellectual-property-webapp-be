import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator<keyof Express.User | undefined>(
  (data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);

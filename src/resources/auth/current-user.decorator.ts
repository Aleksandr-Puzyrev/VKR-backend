import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../resources/users/users.model';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
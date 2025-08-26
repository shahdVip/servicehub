// in src/auth/decorators/user.decorator.ts

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): JwtPayload => {
    // We tell getRequest that we expect a request object that matches our interface.
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();

    // All errors are now gone because TypeScript understands the shape of 'request'.
    return request.user;
  },
);

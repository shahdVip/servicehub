// in src/auth/guards/roles.guard.ts

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../users/enums/roles.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Get the required roles from the @Roles() decorator metadata
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(), // Check the method first (e.g., adminEndpoint())
      context.getClass(), // Then check the controller class
    ]);

    // 2. If the endpoint has no @Roles() decorator, allow access
    if (!requiredRoles) {
      return true;
    }

    // 3. Get the user object from the request (attached by JwtAuthGuard)
    const { user }: { user: JwtPayload } = context.switchToHttp().getRequest();

    // 4. Check if the user's role is included in the required roles
    // The `.some()` method returns true if at least one role matches.
    return requiredRoles.some((role) => user.role === role);
  }
}

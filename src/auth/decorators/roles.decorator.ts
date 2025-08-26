// in src/auth/decorators/roles.decorator.ts

import { SetMetadata } from '@nestjs/common';
import { Role } from '../../users/enums/roles.enum';

export const ROLES_KEY = 'roles';

/**
 * A custom decorator to attach required roles to a route handler.
 * @param roles The list of roles that are allowed to access the route.
 * Example: @Roles(Role.ADMIN, Role.SERVICE_PROVIDER)
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

// in src/auth/interfaces/jwt-payload.interface.ts

import { Role } from '../../users/enums/roles.enum';

export interface JwtPayload {
  /**
   * The user's email address.
   */
  email: string;

  /**
   * The user's unique ID (the "subject" of the token).
   */
  sub: string;

  /**
   * The user's role.
   */
  role: Role;
}

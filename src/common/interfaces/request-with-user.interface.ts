import { Request } from 'express';
import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';

/**
 * Extends the default Express Request interface to include the `user`
 * property, which is attached by the JwtAuthGuard after a token
 * has been successfully validated.
 */
export interface RequestWithUser extends Request {
  /**
   * The decoded JWT payload attached to the request.
   * Its shape is defined by the JwtPayload interface.
   */
  user: JwtPayload;
}

// in src/auth/jwt.strategy.ts

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './interfaces/jwt-payload.interface'; // <-- 1. Import the interface

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    // 1. Get the secret from the config service
    const jwtSecret = configService.get<string>('JWT_SECRET');

    // 2. Check if the secret is missing
    if (!jwtSecret) {
      // 3. Throw an error to halt the application startup
      throw new Error(
        'JWT_SECRET is not defined in the environment variables.',
      );
    }

    // 4. If the secret exists, proceed with the configuration
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret, // <-- SOLUTION: We now pass a confirmed string
    });
  }

  validate(payload: JwtPayload) {
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}

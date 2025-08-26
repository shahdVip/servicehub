// in src/users/users.controller.ts

import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from './enums/roles.enum';

@Controller('users') // This sets the base path for all routes in this file to '/users'
export class UsersController {
  // We don't need a constructor for this example, but you would add one
  // to inject services if you needed to fetch data.

  @Get('admin-only') // This creates the endpoint: GET /users/admin-only
  @UseGuards(JwtAuthGuard, RolesGuard) // IMPORTANT: Apply both guards
  @Roles(Role.ADMIN) // Specify that ONLY the 'ADMIN' role is allowed
  adminEndpoint() {
    return {
      message:
        'Welcome, Admin! You have successfully accessed a protected route.',
    };
  }
}

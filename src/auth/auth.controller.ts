import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  UnauthorizedException,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from './decorators/user.decorator';
import type { JwtPayload } from './interfaces/jwt-payload.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // This endpoint needs more work (LocalAuthGuard) which we add next
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    // Logic to be completed in the next steps
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.authService.login(user);
  }
  @UseGuards(JwtAuthGuard) // The Bouncer is placed at the door of this route.
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@User() user: JwtPayload) {
    // <-- 2. USE THE DECORATOR
    // The 'user' parameter is now directly injected and fully typed.
    return user;
  }
}

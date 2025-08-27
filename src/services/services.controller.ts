// in src/services/services.controller.ts

import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Patch,
  Delete, // Import Delete
  ParseUUIDPipe,
  NotFoundException, // Import NotFoundException
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/enums/roles.enum';
import { User } from '../auth/decorators/user.decorator';
import { UsersService } from '../users/users.service';
import { UpdateServiceDto } from './dto/update-service-dto';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Controller('services')
export class ServicesController {
  constructor(
    private readonly servicesService: ServicesService,
    private readonly usersService: UsersService, // This injection is needed for this approach
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SERVICE_PROVIDER)
  async create(
    @Body() createServiceDto: CreateServiceDto,
    @User() jwtPayload: JwtPayload, // This correctly injects the JWT payload
  ) {
    // --- VITAL DEBUGGING LOG ---
    console.log('--- CREATE SERVICE REQUEST ---');
    console.log('JWT Payload Received by Controller:', jwtPayload);
    console.log('jwtpayload.sub', jwtPayload.email);

    // Fetch the full User entity from the database using the ID from the JWT
    const provider = await this.usersService.findOneById(jwtPayload.sub);
    console.log(provider);

    // Now, pass the full entity to the create service method
    return this.servicesService.create(createServiceDto, provider);
  }

  @Get()
  findAll() {
    return this.servicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.servicesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SERVICE_PROVIDER)
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateServiceDto: UpdateServiceDto,
    @User() jwtPayload: JwtPayload,
  ) {
    // We need the full user entity to check for ownership
    const user = await this.usersService.findOneById(jwtPayload.sub);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.servicesService.update(id, updateServiceDto, user);
  }

  // We will implement the DELETE logic in the next step
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SERVICE_PROVIDER, Role.ADMIN) // Allow both roles to hit the endpoint
  async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @User() jwtPayload: JwtPayload,
  ) {
    const user = await this.usersService.findOneById(jwtPayload.sub);
    await this.servicesService.remove(id, user);
    // On successful deletion, it's common to return nothing with a 204 No Content status
    // NestJS handles this automatically if the method returns void/undefined.
  }
}

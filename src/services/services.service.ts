import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { User } from '../users/user.entity'; // Import the User entity
import { UpdateServiceDto } from './dto/update-service-dto'; // Import the new DTO
import { Role } from '../users/enums/roles.enum'; // Import Role enum
@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly servicesRepository: Repository<Service>,
  ) {}

  /**
   * Creates a new service and associates it with the provider.
   * @param createServiceDto The data for the new service.
   * @param provider The user entity of the service provider.
   * @returns The newly created service entity.
   */
  async create(
    createServiceDto: CreateServiceDto,
    provider: User,
  ): Promise<Service> {
    const newService = this.servicesRepository.create({
      ...createServiceDto,
      provider, // This is the magic! Associate the user with the service.
    });

    return this.servicesRepository.save(newService);
  }
  /**
   * Retrieves all services.
   * @returns A list of all services.
   */
  async findAll(): Promise<Service[]> {
    return this.servicesRepository.find();
  }

  /**
   * Finds a single service by its ID.
   * @param id The ID of the service to find.
   * @returns The found service entity.
   * @throws NotFoundException if the service cannot be found.
   */
  async findOne(id: string): Promise<Service> {
    const service = await this.servicesRepository.findOneBy({ id });

    if (!service) {
      throw new NotFoundException(`Service with ID "${id}" not found`);
    }

    return service;
  }
  /**
   * Updates a service, ensuring the user is the owner.
   * @param id The ID of the service to update.
   * @param updateServiceDto The new data for the service.
   * @param user The currently authenticated user.
   * @returns The updated service entity.
   */
  async update(
    id: string,
    updateServiceDto: UpdateServiceDto,
    user: User,
  ): Promise<Service> {
    const service = await this.findOne(id); // Re-use findOne to handle the not-found case

    // --- AUTHORIZATION CHECK ---
    if (service.provider.id !== user.id) {
      throw new ForbiddenException(
        'You are not allowed to update this service.',
      );
    }

    // Merge the new data into the found service object
    Object.assign(service, updateServiceDto);

    return this.servicesRepository.save(service);
  }
  /**
   * Deletes a service, ensuring the user is the owner or an admin.
   * @param id The ID of the service to delete.
   * @param user The user attempting to delete the service.
   */
  async remove(id: string, user: User): Promise<void> {
    const service = await this.findOne(id); // Re-use findOne to handle not-found

    // AUTHORIZATION CHECK: Allow if the user is the owner OR if the user is an admin
    const isOwner = service.provider.id === user.id;
    const isAdmin = user.role === Role.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException(
        'You are not allowed to delete this service.',
      );
    }

    await this.servicesRepository.remove(service);
  }
}

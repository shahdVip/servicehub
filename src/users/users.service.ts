import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto'; // We will create this DTO
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.usersRepository.save(newUser);
  }
  async findOneByEmail(email: string): Promise<User | null> {
    // Explicitly ask for the password field when needed for auth
    return this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'name', 'role', 'password'],
    });
  }
  /**
   * Finds a single user by their ID.
   * @param id The UUID of the user to find.
   * @returns The full user entity.
   * @throws NotFoundException if no user is found with the given ID.
   */
  async findOneById(id: string): Promise<User> {
    console.log('find by id', id);

    const user = await this.usersRepository.findOneBy({ id });
    console.log('user:', user);

    if (!user) {
      // Throw an exception if the user is not found.
      // This is important for security and data integrity.
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return user;
  }
}

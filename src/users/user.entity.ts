import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Role } from './enums/roles.enum';
import { Service } from '../services/entities/service.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ select: false }) // Important: Prevents password from being returned in queries by default
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;
  /**
   * RELATIONSHIP: One user (provider) can have many services.
   */
  @OneToMany(() => Service, (service) => service.provider)
  services: Service[];
}

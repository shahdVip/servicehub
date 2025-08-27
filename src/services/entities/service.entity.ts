import { User } from '../../users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity({ name: 'services' })
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  /**
   * RELATIONSHIP: Many services can belong to one user (provider).
   * This is the owning side of the relationship.
   */
  @ManyToOne(() => User, (user) => user.services, { eager: true })
  provider: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

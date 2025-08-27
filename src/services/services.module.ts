import { Module } from '@nestjs/common';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { AuthModule } from '../auth/auth.module'; // <-- Import AuthModule
import { UsersModule } from '../users/users.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Service]), // Make the Service entity available in this module
    AuthModule,
    UsersModule,
  ],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule {}

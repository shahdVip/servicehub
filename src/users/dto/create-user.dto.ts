import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';
import { Role } from '../enums/roles.enum';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  name: string;

  @IsEnum(Role)
  role: Role;
}

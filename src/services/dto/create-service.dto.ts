import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Type(() => Number) // Transform the incoming value to a number
  price: number;
}

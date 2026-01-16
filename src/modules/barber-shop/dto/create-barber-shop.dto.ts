import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBarberShopDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @IsString()
  @IsNotEmpty()
  descripton: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @MaxLength(15)
  @MinLength(5)
  @IsNotEmpty()
  password: string;
}

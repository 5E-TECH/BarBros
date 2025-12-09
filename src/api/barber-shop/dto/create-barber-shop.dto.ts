import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateBarberShopDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  descripton: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @MaxLength(15)
  @MinLength(5)
  @IsNotEmpty()
  password: string;
}

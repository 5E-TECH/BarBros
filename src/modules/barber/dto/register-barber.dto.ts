import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export class RegisterBarberDto {
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsString()
  @IsPhoneNumber('UZ')
  @IsNotEmpty()
  phone_number: string;


  @IsString()
  @IsNotEmpty()
  @Length(5, 15, {
    message: `Parol uzunligi 5 dan 15 belgigacha bo'lishi kerak`,
  })
  password: string;

  @IsNotEmpty()
  username: string;

  @IsString()
  @Length(8, 300, { message: "bio uzunligi 8 dan 300 gacha bo'lishi kerak" })
  @IsNotEmpty()
  bio: string;


  @IsString()
  @IsNotEmpty()
  barberShop_id: number;

}

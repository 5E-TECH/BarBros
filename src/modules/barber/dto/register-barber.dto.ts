import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsNumber,
  Length,
} from 'class-validator';

export class RegisterBarberDto {

  @ApiProperty({ example: 'Ali Valiyev' })
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @ApiProperty({ example: '+998901234567' })
  @IsPhoneNumber('UZ')
  phone_number: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @Length(5, 15, {
    message: `Parol uzunligi 5 dan 15 belgigacha bo'lishi kerak`,
  })
  password: string;

  @ApiProperty({ example: 'ali_barber' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: '5 yillik tajribaga ega barber' })
  @IsString()
  @Length(8, 300, {
    message: "bio uzunligi 8 dan 300 gacha bo'lishi kerak",
  })
  bio: string;

  // @ApiProperty({ example: 2 })
  // @Type(() => Number)  // 👈 shu qo‘shildi
  // @IsNumber()
  // barberShop_id: number;
}

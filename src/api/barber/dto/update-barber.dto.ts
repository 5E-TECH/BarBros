import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';

export class UpdateBarberDto {
  @IsString()
  @IsOptional()
  full_name: string;

  @IsString()
  @IsPhoneNumber('UZ')
  @IsOptional()
  phone_number: string;

  @IsString()
  @Length(8, 300, { message: "bio uzunligi 8 dan 300 gacha bo'lishi kerak" })
  @IsOptional()
  bio: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true || value === 1 || value === '1')
      return true;
    if (value === 'false' || value === false || value === 0 || value === '0')
      return false;
    return value;
  })
  is_avaylbl: boolean;
<<<<<<< HEAD
=======

  @IsString()
  @IsOptional()
  img: string; // <-- img maydoni qo‘shildi
>>>>>>> decbac9 (frony)
}

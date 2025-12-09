import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
<<<<<<< HEAD
=======

>>>>>>> decbac9 (frony)
export class UpdateBarberShopDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  location: string;

  @IsString()
  @IsOptional()
  descripton: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  phoneNumber: string;

<<<<<<< HEAD
=======
  @IsString()
  @IsOptional()
  img: string; // <-- bu qatorni qo‘shish kerak
>>>>>>> decbac9 (frony)
}

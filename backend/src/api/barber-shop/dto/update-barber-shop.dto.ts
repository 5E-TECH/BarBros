import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

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

  @IsString()
  @IsOptional()
  img: string; // <-- bu qatorni qo‘shish kerak
}

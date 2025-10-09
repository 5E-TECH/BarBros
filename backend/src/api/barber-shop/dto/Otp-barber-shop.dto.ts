import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class OtpBarberShopDto {
  @ApiProperty({ description: 'Email', example: "email@gmail.com" })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'otp token', example: "346526" })
  @IsString()
  @IsNotEmpty()
  otp: number;
}

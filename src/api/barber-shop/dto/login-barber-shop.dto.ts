import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LogimBarberShopDto {

  @ApiProperty({example: "+998930451852"})
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({example: "email@gmail.com"})
  @IsEmail()
  @IsNotEmpty()
  email:string

  @ApiProperty({example: "12345678"})
  @IsString()
  @IsNotEmpty()
  password: string;
}

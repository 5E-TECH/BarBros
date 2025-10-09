import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginBarberDto {
  @ApiProperty({ description: 'password', example: '1234User#' })
  @IsString()
  @IsNotEmpty()
  @Length(5, 15, {
    message: `Parol uzunligi 5 dan 15 belgigacha bo'lishi kerak`,
  })
  password: string;

  @ApiProperty({ description: 'Email', example: 'karalevstvabitva@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

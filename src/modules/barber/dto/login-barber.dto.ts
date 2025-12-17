import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginBarberDto {
  @ApiProperty({ description: 'password', example: '12345678' })
  @IsString()
  @IsNotEmpty()
  @Length(5, 15, {
    message: `Parol uzunligi 5 dan 15 belgigacha bo'lishi kerak`,
  })
  password: string;

  @ApiProperty({ description: 'Email', example: 'faxame' })
  @IsNotEmpty()
  username: string;
}

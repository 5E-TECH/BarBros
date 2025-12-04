import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginAdminDto {
  @ApiProperty({ example: 'admin@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  login: string;

  @ApiProperty({ example: 'AdminSecurePassword' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

import { ApiProperty } from '@nestjs/swagger';
<<<<<<< HEAD
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ example: 'karalevstvabitva@gmail.com' })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '50803006730015' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  @MinLength(5)
  password: string;
=======
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ example: '+998990000000' })
  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @ApiProperty({ example: '0000' })
  @IsString()
  @IsNotEmpty()
  code: string;
>>>>>>> decbac9 (frony)
}

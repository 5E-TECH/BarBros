import { ApiProperty } from '@nestjs/swagger';
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
}

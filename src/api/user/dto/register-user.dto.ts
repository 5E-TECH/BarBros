import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/common/enum';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({ example: 'Faxriddin Maripov' })
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @ApiProperty({ example: '+998930451852' })
  @IsString()
  @IsNotEmpty()
  phone_number: string;

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

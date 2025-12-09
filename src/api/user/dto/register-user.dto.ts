import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/common/enum';
import {
  IsEmail,
<<<<<<< HEAD
  IsEnum,
=======
>>>>>>> decbac9 (frony)
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({ example: 'Faxriddin Maripov' })
  @IsString()
<<<<<<< HEAD
  @IsNotEmpty()
=======
>>>>>>> decbac9 (frony)
  full_name: string;

  @ApiProperty({ example: '+998930451852' })
  @IsString()
  @IsNotEmpty()
  phone_number: string;

<<<<<<< HEAD
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


>>>>>>> decbac9 (frony)
}

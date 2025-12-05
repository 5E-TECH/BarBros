import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/common/enum';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({ example: 'Faxriddin Maripov' })
  @IsString()
  full_name: string;

  @ApiProperty({ example: '+998930451852' })
  @IsString()
  @IsNotEmpty()
  phone_number: string;



}

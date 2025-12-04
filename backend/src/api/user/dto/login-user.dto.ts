import { ApiProperty } from '@nestjs/swagger';
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
}

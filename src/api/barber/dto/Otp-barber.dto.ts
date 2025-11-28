import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class OtpBarberDto {

  @ApiProperty({ description: 'Email', example: 'karalevstvabitva@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({description: "otp token", example: "346526"})
  @IsString()
  @IsNotEmpty()
  otp: number
}

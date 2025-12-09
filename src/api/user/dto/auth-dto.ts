import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: '+998901234567',
    description: 'User phone number',
  })
  @IsString()
  @IsNotEmpty()
  phone_number: string;
}

export class VerifyDto {
  @ApiProperty({
    example: '+998901234567',
    description: 'User phone number',
  })
  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @ApiProperty({
    example: '0000',
    description: 'Verification code sent to phone',
  })
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class FullNameDto {
  @ApiProperty({
    example: 'Faxriddin Maripov',
    description: 'User full name',
  })
  @IsString()
  @IsOptional()
  full_name: string;
}
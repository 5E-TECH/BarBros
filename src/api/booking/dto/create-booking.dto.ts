import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ example: 'service_id' })
  @IsString()
  @IsNotEmpty()
  service_id: string;

  @ApiProperty({ example: 'barber_id' })
  @IsString()
  @IsNotEmpty()
  barber_id: string;

  @ApiProperty({ example: '2025-12-12' })
  @IsString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ example: '14:30:00' })
  @IsString()
  @IsNotEmpty()
  time: string;
}

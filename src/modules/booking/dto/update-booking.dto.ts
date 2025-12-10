import { ApiProperty } from '@nestjs/swagger';
import {IsNotEmpty, IsString } from 'class-validator';

export class UpdateBookingDto {

  @ApiProperty({ example: 'barber_id' })
  @IsString()
  @IsNotEmpty()
  barber_id: number;

  @ApiProperty({ example: '2025-12-12' })
  @IsString()
  @IsNotEmpty()
  date: string;

}

import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ArrayNotEmpty,
} from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({ example: 35000, required: false })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({ example: 'Oddiy erkaklar soch turmagi' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'Haircut' })
  @IsString()
  name: string;

  @ApiProperty({ example: 30 })
  @IsNumber()
  duration_minutes: number;

  @ApiProperty({
    example: [1, 2, 5],
    description: 'service qila oladigan barberlar idlari',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  barber_ids?: number[];

  @ApiProperty({ example: 3 })
  @IsNumber()
  category_id: number;
}

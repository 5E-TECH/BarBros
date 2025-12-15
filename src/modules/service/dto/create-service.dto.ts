import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ArrayNotEmpty,
} from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({ example: 35000 })
  @IsNumber()
  price: number;

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
  })
  @IsArray()
  @ArrayNotEmpty()
  barber_ids: number[];

  @ApiProperty({ example: 3 })
  @IsNumber()
  category_id: number;
}

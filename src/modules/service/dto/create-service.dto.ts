import { ApiProperty } from '@nestjs/swagger';
import {
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({ example: 35000 })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ example: 'kelorasilar' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'JOXA' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'JOXA' })
  @IsString()
  @IsNotEmpty()
  barber_id: string;

  @ApiProperty({ example: 30 })
  @IsNumber()
  @IsNotEmpty()
  duration_minutes: number;

}

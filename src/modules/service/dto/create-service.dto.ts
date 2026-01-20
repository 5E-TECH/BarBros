import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({ example: 'Oddiy erkaklar soch turmagi' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'Haircut' })
  @IsString()
  name: string;

  @ApiProperty({ example: 30 })
  @IsNumber()
  duration_minutes: number;

  @ApiProperty({ example: 3 })
  @IsNumber()
  category_id: number;
}

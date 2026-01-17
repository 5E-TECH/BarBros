import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class CreateServiceImageDto {
  @ApiProperty({ example: 3 })
  @Type(() => Number)
  @IsInt()
  service_id: number;

  @ApiProperty({ example: 12, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  barber_shop_id?: number;
}

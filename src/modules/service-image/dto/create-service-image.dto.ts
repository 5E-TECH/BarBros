import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';

export class CreateServiceImageDto {
  @ApiProperty({ example: 3 })
  @IsInt()
  service_id: number;

  @ApiProperty({ example: 12, required: false })
  @IsOptional()
  @IsInt()
  barber_shop_id?: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class CreateBarberShopServiceDto {
  @ApiProperty({ example: 3 })
  @IsNumber()
  service_id: number;

  @ApiProperty({ example: 45000 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 60, description: 'Service davomiyligi (minut)' })
  @IsNumber()
  duration_minutes: number;

  @ApiProperty({ example: 12, required: false })
  @IsOptional()
  @IsNumber()
  barber_shop_id?: number;
}

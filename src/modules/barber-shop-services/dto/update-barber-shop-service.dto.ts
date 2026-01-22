import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateBarberShopServiceDto {
  @ApiPropertyOptional({ example: 55000 })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({ example: 60, description: 'Service davomiyligi (minut)' })
  @IsOptional()
  @IsNumber()
  duration_minutes?: number;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsNumber()
  service_id?: number;

  @ApiPropertyOptional({ example: 12 })
  @IsOptional()
  @IsNumber()
  barber_shop_id?: number;
}

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdatePlanDto {
  @ApiPropertyOptional({ example: 'Monthly' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  duration_months?: number;

  @ApiPropertyOptional({ example: 120000 })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

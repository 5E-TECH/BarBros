import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePlanDto {
  @ApiProperty({ example: 'Monthly' })
  @IsString()
  name: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  duration_months: number;

  @ApiProperty({ example: 120000 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

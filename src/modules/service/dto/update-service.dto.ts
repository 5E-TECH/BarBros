import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateServiceDto {
  @ApiProperty({ example: 'kelorasilar' })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ example: 'JOXA' })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ example: 30 })
  @IsNumber()
  @IsOptional()
  duration_minutes: number;

}

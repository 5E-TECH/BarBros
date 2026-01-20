import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class CreateServiceImageDto {
  @ApiProperty({ example: 3 })
  @Type(() => Number)
  @IsInt()
  service_id: number;
}

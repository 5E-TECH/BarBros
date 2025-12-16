import { IsArray, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AddBarbersToServiceDto {
  @ApiProperty({
    description: 'Service ID',
    example: 1,       // bu yerda misol uchun 1 berilgan
  })
  @IsNumber()
  @Type(() => Number)
  service_id: number;

  @ApiProperty({
    description: 'Array of barber IDs to add to the service',
    example: [2, 3, 5],  // bu yerda misol uchun barber idlari
    type: [Number],
  })
  @IsArray()
  @Type(() => Number)
  barber_ids: number[];
}

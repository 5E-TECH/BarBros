import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateImageDto {
  @ApiProperty({
    example: '77071848-bc97-4bf2-8c4d-5f746a90e405',
  })
  @IsString()
  @IsNotEmpty()
  barberShop_id: number;

}

import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean } from 'class-validator';

export class UpdateBarberShopStatus {
  @ApiProperty({ example: 'true and false' })
  @Transform(({ value }) => {
    if (value === 'true' || value === true || value === 1 || value == '1')
      return true;
    if (value === 'false' || value === false || value === 0 || value == '0')
      return false;
    return value;
  })
  @IsBoolean()
  status: boolean;
}

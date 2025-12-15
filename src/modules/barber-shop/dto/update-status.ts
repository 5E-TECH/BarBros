import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty } from 'class-validator';
import { Status } from 'src/common/enum';

export class UpdateBarberShopStatus {
  @ApiProperty({ example: 'inactive and active' })
  @IsNotEmpty()
  status: Status;
}

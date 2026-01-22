import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BookingStatus } from 'src/common/enum';

export class UpdateBookingDto {

  @ApiProperty({ enum: BookingStatus, required: false })
  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;

}

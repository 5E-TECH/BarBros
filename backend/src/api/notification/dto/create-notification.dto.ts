import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({
    example: 'Yangi xabar keldi',
  })
  @IsString()
  message: string;

  @ApiProperty({
    example: true,
  })
  @IsBoolean()
  is_read: boolean;
}

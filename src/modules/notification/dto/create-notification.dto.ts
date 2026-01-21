import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({
    example: 'Yangi xabar keldi',
  })
  @IsString()
  message: string;

  @ApiProperty({
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_read?: boolean;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  user_id?: number;

  @ApiProperty({ example: 2, required: false })
  @IsOptional()
  @IsInt()
  barber_id?: number;

  @ApiProperty({ example: 3, required: false })
  @IsOptional()
  @IsInt()
  barber_shop_id?: number;
}

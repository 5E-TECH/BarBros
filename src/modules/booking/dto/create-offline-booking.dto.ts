import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { PaymentModel } from 'src/common/enum';

export class CreateOfflineBookingDto {
  @ApiProperty({ example: 2, description: 'User ID (mijoz)' })
  @IsNumber()
  @IsNotEmpty()
  user_id: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  service_id: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @IsNotEmpty()
  barber_id: number;

  @ApiProperty({ example: 3 })
  @IsNumber()
  @IsNotEmpty()
  barber_shop_id: number;

  @ApiProperty({ example: '2025-12-12' })
  @IsString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ example: '14:30:00' })
  @IsString()
  @IsNotEmpty()
  time: string;

  @ApiProperty({ enum: PaymentModel, example: PaymentModel.CASH })
  @IsEnum(PaymentModel)
  @IsNotEmpty()
  payment_model: PaymentModel;
}

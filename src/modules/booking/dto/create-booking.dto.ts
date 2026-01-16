import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { OrderType, PaymentModel } from 'src/common/enum';

export class CreateBookingDto {
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

  @ApiProperty({ enum: OrderType, example: OrderType.ONLINE })
  @IsEnum(OrderType)
  @IsNotEmpty()
  order_type: OrderType;
}

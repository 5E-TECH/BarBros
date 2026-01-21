import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';
import { PaymentModel } from 'src/common/enum';

export class AssignSubscriptionDto {
  @ApiProperty({ example: 3 })
  @IsNumber()
  barber_shop_id: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  plan_id: number;

  @ApiProperty({ enum: PaymentModel, example: PaymentModel.CASH })
  @IsEnum(PaymentModel)
  payment_model: PaymentModel;
}

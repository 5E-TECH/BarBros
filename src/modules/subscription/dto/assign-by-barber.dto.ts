import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';
import { PaymentModel } from 'src/common/enum';

export class AssignByBarberDto {
  @ApiProperty({ example: 10, description: 'Barber ID' })
  @IsNumber()
  barber_id: number;

  @ApiProperty({ example: 1, description: 'Plan ID' })
  @IsNumber()
  plan_id: number;

  @ApiProperty({ enum: PaymentModel, example: PaymentModel.CASH })
  @IsEnum(PaymentModel)
  payment_model: PaymentModel;
}

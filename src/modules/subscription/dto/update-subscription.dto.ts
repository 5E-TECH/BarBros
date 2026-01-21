import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { PaymentModel, PaymentStatus, SubscriptionStatus } from 'src/common/enum';

export class UpdateSubscriptionDto {
  @ApiPropertyOptional({ enum: SubscriptionStatus })
  @IsOptional()
  @IsEnum(SubscriptionStatus)
  status?: SubscriptionStatus;

  @ApiPropertyOptional({ enum: PaymentStatus })
  @IsOptional()
  @IsEnum(PaymentStatus)
  payment_status?: PaymentStatus;

  @ApiPropertyOptional({ enum: PaymentModel })
  @IsOptional()
  @IsEnum(PaymentModel)
  payment_model?: PaymentModel;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  plan_id?: number;
}

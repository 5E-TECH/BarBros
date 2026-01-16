import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from 'src/common/database/baseEntity';
import { PaymentModel, PaymentStatus } from 'src/common/enum';

@Entity('transactions')
export class TransactionEntity extends BaseEntity {
  @Column({ type: 'bigint' })
  @Index({ unique: true })
  booking_id: number;

  @Column({ type: 'bigint' })
  barber_id: number;

  @Column({ type: 'bigint' })
  barber_shop_id: number;

  @Column({ type: 'bigint' })
  service_id: number;

  @Column({ type: 'int' })
  amount: number;

  @Column({ type: 'enum', enum: PaymentModel })
  payment_model: PaymentModel;

  @Column({ type: 'enum', enum: PaymentStatus })
  payment_status: PaymentStatus;
}

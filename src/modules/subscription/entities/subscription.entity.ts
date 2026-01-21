import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/common/database/baseEntity';
import { BarberShopEntity } from 'src/modules/barber-shop/entities/barber-shop.entity';
import { SubscriptionPlanEntity } from './subscription-plan.entity';
import { PaymentModel, PaymentStatus, SubscriptionStatus } from 'src/common/enum';

@Entity('subscriptions')
export class SubscriptionEntity extends BaseEntity {
  @Column({ type: 'bigint' })
  barber_shop_id: number;

  @Column({ type: 'bigint' })
  plan_id: number;

  @Column({ type: 'bigint' })
  start_at: number;

  @Column({ type: 'bigint' })
  end_at: number;

  @Column({ type: 'enum', enum: SubscriptionStatus })
  status: SubscriptionStatus;

  @Column({ type: 'enum', enum: PaymentModel })
  payment_model: PaymentModel;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PAID })
  payment_status: PaymentStatus;

  @Column({ type: 'boolean', default: false })
  reminder_sent: boolean;

  @ManyToOne(() => BarberShopEntity, (shop) => shop.subscriptions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'barber_shop_id' })
  barberShop: BarberShopEntity;

  @ManyToOne(() => SubscriptionPlanEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'plan_id' })
  plan: SubscriptionPlanEntity;
}

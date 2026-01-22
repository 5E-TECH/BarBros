import { Column, Entity } from 'typeorm';
import { BaseEntity } from 'src/common/database/baseEntity';

@Entity('subscription_plans')
export class SubscriptionPlanEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'int' })
  duration_months: number;

  @Column({ type: 'int' })
  price: number;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;
}

import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/common/database/baseEntity';
import { UserEntity } from 'src/modules/user/entities/user.admin,entity';
import { ServiceEntity } from 'src/modules/service/entities/service.entity';
import { BarberEntity } from 'src/modules/barber/entities/barber.entity';
import { BarberShopEntity } from 'src/modules/barber-shop/entities/barber-shop.entity';
import { BookingStatus, OrderType, PaymentModel, PaymentStatus } from 'src/common/enum';

@Entity('booking')
export class BookingEntity extends BaseEntity {

  @Column({ type: 'int' })
  user_id: number;

  @Column({ type: 'int' })
  service_id: number;

  @Column({ type: 'int' })
  barber_shop_id: number;

  @Column({ type: 'int' })
  barber_id: number;

  @Column({ type: 'varchar' })
  date: string;

  @Column({ type: 'varchar' })
  time: string;

  @Column({ type: 'boolean', default: false })
  reminder_sent: boolean;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  payment_status: PaymentStatus;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @Column({ type: 'enum', enum: PaymentModel })
  payment_model: PaymentModel;

  @Column({ type: 'enum', enum: OrderType })
  order_type: OrderType;

  @ManyToOne(() => UserEntity, (user) => user.booking, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => ServiceEntity, (service) => service.booking, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'service_id' })
  service: ServiceEntity;

  @ManyToOne(() => BarberShopEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'barber_shop_id' })
  barberShop: BarberShopEntity;

  @ManyToOne(() => BarberEntity, (barber) => barber.booking, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'barber_id' })
  barber: BarberEntity;
}


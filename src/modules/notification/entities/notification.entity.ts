import { BaseEntity } from 'src/common/database/baseEntity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from 'src/modules/user/entities/user.admin,entity';
import { BarberEntity } from 'src/modules/barber/entities/barber.entity';
import { BarberShopEntity } from 'src/modules/barber-shop/entities/barber-shop.entity';

@Entity('notifications')
export class NotificationEntity extends BaseEntity {
  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'boolean', default: false })
  is_read: boolean;

  @Column({ type: 'bigint', nullable: true })
  user_id: number | null;

  @Column({ type: 'bigint', nullable: true })
  barber_id: number | null;

  @Column({ type: 'bigint', nullable: true })
  barber_shop_id: number | null;

  @ManyToOne(() => UserEntity, (user) => user.notifikation, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => BarberEntity, (barber) => barber.notification, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'barber_id' })
  barber: BarberEntity;

  @ManyToOne(() => BarberShopEntity, (shop) => shop.notifications, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'barber_shop_id' })
  barberShop: BarberShopEntity;
}

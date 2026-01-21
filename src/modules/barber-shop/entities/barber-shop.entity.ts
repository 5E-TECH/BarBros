import { BaseEntity } from 'src/common/database/baseEntity';
import { Column, Entity, OneToMany } from 'typeorm';
import { BarberEntity } from 'src/modules/barber/entities/barber.entity';
import { ImageEntity } from 'src/modules/images/entities/image.entity';
import { BarberShopServicesEntity } from 'src/modules/barber-shop-services/entities/barber-shop-services.entity';
import { UserRole, Status } from 'src/common/enum';
import { SubscriptionEntity } from 'src/modules/subscription/entities/subscription.entity';
import { NotificationEntity } from 'src/modules/notification/entities/notification.entity';

@Entity()
export class BarberShopEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  location: string;

  @Column({ type: 'double precision', nullable: true })
  latitude: number | null;

  @Column({ type: 'double precision', nullable: true })
  longitude: number | null;

  @Column({ type: 'varchar', default: null })
  img: string | null;

  @Column({ type: 'varchar' })
  descripton: string;

  @Column({ type: 'varchar', unique: true })
  phoneNumber: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar', unique: true })
  username: string;

  @Column({ type: 'varchar', default: UserRole.SP_ADMIN })
  role: UserRole.SP_ADMIN;

  @Column({ type: 'enum', enum: Status, default: Status.INACTIVE })
  status: Status;

  @Column({ type: 'decimal', default: 0 })
  avg_rating: number;

  @OneToMany(() => BarberEntity, (barber) => barber.barberShop)
  barber: BarberEntity[];

  @OneToMany(() => ImageEntity, (image) => image.barberShop)
  images: ImageEntity[];

  @OneToMany(
    () => BarberShopServicesEntity,
    (barberShopService) => barberShopService.barberShop,
  )
  barberShopServices: BarberShopServicesEntity[];

  @OneToMany(() => SubscriptionEntity, (subscription) => subscription.barberShop)
  subscriptions: SubscriptionEntity[];

  @OneToMany(() => NotificationEntity, (notification) => notification.barberShop)
  notifications: NotificationEntity[];

}

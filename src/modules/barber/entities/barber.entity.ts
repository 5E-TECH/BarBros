import { BaseEntity } from 'src/common/database/baseEntity';
import { UserRole } from 'src/common/enum';
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { ReytingEntity } from 'src/modules/rayting/entities/reyting.entity';
import { BookingEntity } from 'src/modules/booking/entities/booking.entity';
import { BarberImageEntity } from 'src/modules/barber_images/entities/barber_image.entity';
import { BarberScheduleEntity } from 'src/modules/barber_schedule/entities/barber_schedule.entity';
import { BarberShopEntity } from 'src/modules/barber-shop/entities/barber-shop.entity';
import { ServiceEntity } from '../../service/entities/service.entity';
import { ChatEntity } from 'src/modules/chat/entities/chat.entity';
import { NotificationEntity } from 'src/modules/notification/entities/notification.entity';

@Entity('barber')
export class BarberEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  full_name: string;

  @Column({ type: 'varchar', unique: true })
  phone_number: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar', unique: true })
  username: string;

  @Column({ type: 'text' })
  bio: string;

  @Column({ type: 'varchar', default: UserRole.BARBER })
  role: UserRole.BARBER;

  @Column({ type: 'decimal', default: 0 })
  avg_reyting: number;

  @Column({ type: 'text', default: null })
  img: string | null;


  @Column({ type: 'boolean', default: false })
  is_avaylbl: boolean;

  @OneToMany(() => ReytingEntity, (reyting) => reyting.barber)
  reyting: ReytingEntity[];

  @OneToMany(() => BookingEntity, (booking) => booking.barber)
  booking: BookingEntity[];

  @OneToMany(() => BarberImageEntity, (barberImage) => barberImage.barber)
  barberImage: BarberImageEntity[];

  @OneToMany(() => BarberScheduleEntity, (barberSchuld) => barberSchuld.barber)
  barberSchuld: BarberScheduleEntity[];

  @OneToMany(() => ChatEntity, (chat) => chat.barber)
  chat: ChatEntity[];

  @OneToMany(() => NotificationEntity, (notification) => notification.barber)
  notification: NotificationEntity[];

  @ManyToOne(() => BarberShopEntity, (barberShop) => barberShop.barber, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'barberShop_id' })
  barberShop: BarberShopEntity;

  @ManyToMany(() => ServiceEntity, (service) => service.barbers)
  service: ServiceEntity[];
}

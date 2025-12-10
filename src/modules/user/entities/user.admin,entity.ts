import { Column, Entity, OneToMany } from 'typeorm';
import { UserRole } from 'src/common/enum';
import { BaseEntity } from 'src/common/database/baseEntity';
import { ReytingEntity } from 'src/modules/reyting/entities/reyting.entity';
import { NotificationEntity } from 'src/modules/notification/entities/notification.entity';
import { BookingEntity } from 'src/modules/booking/entities/booking.entity';

@Entity('user')
export class UserEntity extends BaseEntity {
  @Column({ type: 'varchar', nullable:true })
  full_name?: string;

  @Column({ type: 'varchar', nullable: true })
  email?: string;

  @Column({ type: 'varchar', nullable: true })
  password?: string;

  @Column({ type: 'varchar', unique: true })
  phone_number: string;

  @Column({ type: 'varchar', nullable: true })
  code: string;

  @Column({ type: 'varchar', default: UserRole.USER })
  role: UserRole.ADMIN | UserRole.USER | UserRole.SUPPER_ADMIN;

  @OneToMany(() => ReytingEntity, (reyting) => reyting.user)
  reyting: ReytingEntity[];

  @OneToMany(() => NotificationEntity, (notifikation) => notifikation.user)
  notifikation: NotificationEntity[];

  @OneToMany(() => BookingEntity, (booking) => booking.user)
  booking: BookingEntity[];
}

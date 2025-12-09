import { Column, Entity, OneToMany } from 'typeorm';
import { UserRole } from 'src/common/enum';
import { BaseEntity } from 'src/common/database/baseEntity';
import { ReytingEntity } from './reyting.entity';
import { NotificationEntity } from './notification.entity';
import { BookingEntity } from './booking.entity';

@Entity('user')
export class AdminEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  full_name?: string;

  @Column({ type: 'varchar',unique: true })
  phone_number: string;

  @Column({ type: 'varchar'})  // email unique bo‘lishi kerak
  email: string;

  @Column({ type: 'varchar' })
  password: string;


  @Column({ type: 'varchar', default: UserRole.USER })
  role: UserRole.ADMIN | UserRole.USER | UserRole.SUPPER_ADMIN;

  @OneToMany(() => ReytingEntity, (reyting) => reyting.user)
  reyting: ReytingEntity[];

  @OneToMany(() => NotificationEntity, (notifikation) => notifikation.user)
  notifikation: NotificationEntity[];

  @OneToMany(() => BookingEntity, (booking) => booking.user)
  booking: BookingEntity[];
}

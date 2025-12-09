<<<<<<< HEAD
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
=======
import { Column, Entity, OneToMany } from 'typeorm';
>>>>>>> decbac9 (frony)
import { UserRole } from 'src/common/enum';
import { BaseEntity } from 'src/common/database/baseEntity';
import { ReytingEntity } from './reyting.entity';
import { NotificationEntity } from './notification.entity';
import { BookingEntity } from './booking.entity';

@Entity('user')
export class UserEntity extends BaseEntity {
<<<<<<< HEAD
  @Column({ type: 'varchar' })
  full_name: string;

  @Column({ type: 'varchar' })
  phone_number: string;

  @Column({ type: 'varchar', unique: true })
=======
  @Column({ type: 'varchar', nullable: true })
  full_name?: string;

  @Column({ type: 'varchar',unique: true })
  phone_number: string;

  @Column({ type: 'varchar',unique:true})  // email unique bo‘lishi kerak
>>>>>>> decbac9 (frony)
  email: string;

  @Column({ type: 'varchar' })
  password: string;

<<<<<<< HEAD
=======
  @Column({ type: 'varchar', nullable: true })
  code: string;

>>>>>>> decbac9 (frony)
  @Column({ type: 'varchar', default: UserRole.USER })
  role: UserRole.ADMIN | UserRole.USER | UserRole.SUPPER_ADMIN;

  @OneToMany(() => ReytingEntity, (reyting) => reyting.user)
  reyting: ReytingEntity[];

  @OneToMany(() => NotificationEntity, (notifikation) => notifikation.user)
  notifikation: NotificationEntity[];

  @OneToMany(() => BookingEntity, (booking) => booking.user)
  booking: BookingEntity[];
}

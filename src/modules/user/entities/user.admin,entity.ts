import { Column, Entity, OneToMany } from 'typeorm';
import { UserRole } from 'src/common/enum';
import { BaseEntity } from 'src/common/database/baseEntity';
import { ReytingEntity } from 'src/modules/rayting/entities/reyting.entity';
import { NotificationEntity } from 'src/modules/notification/entities/notification.entity';
import { BookingEntity } from 'src/modules/booking/entities/booking.entity';

@Entity('user')
export class UserEntity extends BaseEntity {
  @Column({ type: 'varchar', nullable: true })
  full_name?: string;

  @Column({ type: 'varchar', nullable: true })
  username?: string;

  @Column({ type: 'varchar', nullable: true })
  password?: string;

  @Column({ type: 'varchar', unique: true })
  phone_number: string;

  @Column({ type: 'varchar', nullable: true })
  otp: string;

  @Column({ type: 'varchar', default: UserRole.USER })
  role:
    | UserRole.ADMIN
    | UserRole.USER
    | UserRole.SUPPER_ADMIN
    | UserRole.SP_ADMIN
    | UserRole.BARBER
    | UserRole.SP_ADMIN
    

  @Column({ type: 'varchar', nullable:true })
  bio: string;

  @Column({ type: 'varchar',nullable:true })
  avg_rayting: string;

  @Column({ type: 'varchar',nullable:true })
  avatar_image: string;

  @Column({ type: 'boolean',nullable:true })
  is_available: boolean;

  @OneToMany(() => ReytingEntity, (reyting) => reyting.user)
  reyting: ReytingEntity[];

  @OneToMany(() => NotificationEntity, (notifikation) => notifikation.user)
  notifikation: NotificationEntity[];

  @OneToMany(() => BookingEntity, (booking) => booking.user)
  booking: BookingEntity[];
}

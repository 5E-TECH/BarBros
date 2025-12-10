import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { BarberShopEntity } from 'src/modules/barber-shop/entities/barber-shop.entity';
import { BaseEntity } from 'src/common/database/baseEntity';
import { BookingEntity } from 'src/modules/booking/entities/booking.entity';
import { BarberEntity } from '../../barber/entities/barber.entity';

@Entity('services')
export class ServiceEntity extends BaseEntity {
  @Column({type:"int"})
  price: number;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({type:'int'})
  duration_minutes: number;

  @Column()
  barber_id: number;

  @OneToMany(() => BookingEntity, (booking) => booking.service)
  booking: BookingEntity[];

  @ManyToOne(() => BarberEntity, (barber) => barber.service, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'barber_Id' })
  barber: BarberEntity;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { BarberShopEntity } from 'src/core/entity/barber-shop.entity';
import { BaseEntity } from 'src/common/database/baseEntity';
import { BookingEntity } from './booking.entity';
import { BarberEntity } from './barber.entity';

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
  barber_id: string;

  @OneToMany(() => BookingEntity, (booking) => booking.service)
  booking: BookingEntity[];

  @ManyToOne(() => BarberEntity, (barber) => barber.service, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'barber_Id' })
  barber: BarberEntity;
}

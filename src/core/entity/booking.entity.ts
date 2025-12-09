import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BaseEntity } from 'src/common/database/baseEntity';
import { UserEntity } from './user.entity';
import { ServiceEntity } from './service.entity';
import { BarberEntity } from './barber.entity';

@Entity('booking')
export class BookingEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  user_id: number;

  @Column({ type: 'varchar' })
  service_id: number;

  @Column({ type: 'varchar' })
  barber_id: number;

  @Column({ type: "varchar" })
  date: string;

  @Column({ type: "varchar" })
  time: string;

  // @ManyToOne(() => UserEntity, (user) => user.booking, {
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE',
  // })
  // @JoinColumn({ name: 'user_id' })
  // user: UserEntity;

  @ManyToOne(() => ServiceEntity, (service) => service.booking, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'service_id' })
  service: ServiceEntity;

  @ManyToOne(() => BarberEntity, (barber) => barber.booking, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'barber_id' })
  barber: BarberEntity;
}

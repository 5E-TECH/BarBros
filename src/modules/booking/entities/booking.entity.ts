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
import { UserEntity } from 'src/modules/user/entities/user.admin,entity';
import { ServiceEntity } from 'src/modules/service/entities/service.entity';
import { BarberEntity } from 'src/modules/barber/entities/barber.entity';

@Entity('booking')
export class BookingEntity extends BaseEntity {

  @Column({ type: 'int' })
  user_id: number;

  @Column({ type: 'int' })
  service_id: number;

  @Column({ type: 'int' })
  barber_id: number;

  @Column({ type: 'varchar' })
  date: string;

  @Column({ type: 'varchar' })
  time: string;

  @ManyToOne(() => UserEntity, (user) => user.booking, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => ServiceEntity, (service) => service.booking, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'service_id' })
  service: ServiceEntity;

  @ManyToOne(() => BarberEntity, (barber) => barber.booking, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'barber_id' })
  barber: BarberEntity;
}


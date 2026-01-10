import { Entity, Column, ManyToOne, JoinColumn, Index, Unique } from 'typeorm';
import { BaseEntity } from 'src/common/database/baseEntity';
import { BarberEntity } from 'src/modules/barber/entities/barber.entity';

export enum DayOfWeek {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
}

@Entity('barber_schedules')
@Unique(['barber_id', 'day_of_week'])
@Index(['barber_id', 'day_of_week'])
export class BarberScheduleEntity extends BaseEntity {
  @Column({ type: 'enum', enum: DayOfWeek })
  day_of_week: DayOfWeek;

  @Column({ type: 'time' })
  start_time: string;

  @Column({ type: 'time' })
  end_time: string;

  @Column({ type: 'int', default: 0 })
  break_time: number;

  @Column({ type: 'int' })
  barber_id: number;

  @ManyToOne(() => BarberEntity, (barber) => barber.barberSchuld, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'barber_id' })
  barber: BarberEntity;
}
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from 'src/common/database/baseEntity';
import { BarberEntity } from 'src/modules/barber/entities/barber.entity';

@Entity('barber_schedules')
export class BarberScheduleEntity extends BaseEntity {
  @Column()
  start_day: string;

  @Column({type:'varchar'})
  end_day: string;

  @Column({ type: 'varchar' })
  start_time: string;

  @Column({ type: 'varchar' })
  end_time: string;

  @Column({ type: 'int' })
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

import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { BaseEntity } from 'src/common/database/baseEntity';
import { BarberEntity } from 'src/modules/barber/entities/barber.entity';

@Entity('barber_schedules')
export class BarberScheduleEntity extends BaseEntity {


    @Column()
    working_day: string;

    @Column()
    start_time: string;

    @Column()
    end_time: string;

    @Column()
    barber_id: number;

    @ManyToOne(() => BarberEntity, (barber)=> barber.barberSchuld,{
        onDelete: 'CASCADE',
        onUpdate: "CASCADE"
    })
    @JoinColumn({ name: 'barber_id' })
    barber: BarberEntity;

    

}

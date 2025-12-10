import { BaseEntity } from 'src/common/database/baseEntity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BarberEntity } from 'src/modules/barber/entities/barber.entity';

@Entity('barber_image')
export class BarberImageEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  barber_id: number;

  @Column({ type: 'varchar' })
  img: string;

  @ManyToOne(() => BarberEntity, (barber) => barber.barberImage, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'barber_id' })
  barber: BarberEntity;
}

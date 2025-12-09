import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { StarRating } from 'src/common/enum';
import { BaseEntity } from 'src/common/database/baseEntity';
import { BarberEntity } from './barber.entity';
import { UserEntity } from './user.entity';

@Entity('reyting')
export class ReytingEntity extends BaseEntity {
  @Column({ type: 'enum', enum: StarRating })
  star: number;

  @Column({ type: 'varchar' })
  comment: string;

  @Column({ type: 'uuid' })
  barber_id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => BarberEntity, (barber) => barber.reyting, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'barber_id' })
  barber: BarberEntity;

  // @ManyToOne(() => UserEntity, (user) => user.reyting, {
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE',
  // })
  // @JoinColumn({ name: 'user_id' })
  // user: UserEntity;
}

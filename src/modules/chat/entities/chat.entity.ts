import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/common/database/baseEntity';
import { UserEntity } from 'src/modules/user/entities/user.admin,entity';
import { BarberEntity } from 'src/modules/barber/entities/barber.entity';
import { UserRole } from 'src/common/enum';

@Entity('chat')
export class ChatEntity extends BaseEntity {
  @Column({ type: 'text', nullable: true })
  message: string | null;

  @Column({ type: 'varchar', nullable: true })
  image: string | null;

  @Column({ type: 'varchar' })
  sender_role: UserRole;

  @Column({ type: 'bigint' })
  user_id: number;

  @Column({ type: 'bigint' })
  barber_id: number;

  @ManyToOne(() => UserEntity, (user) => user.chat, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => BarberEntity, (barber) => barber.chat, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'barber_id' })
  barber: BarberEntity;
}

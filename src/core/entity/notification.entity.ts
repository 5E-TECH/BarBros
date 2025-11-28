import { BaseEntity } from 'src/common/database/baseEntity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('notifications')
export class NotificationEntity extends BaseEntity {
  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'boolean' })
  is_read: boolean;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => UserEntity, (user) => user.notifikation, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}

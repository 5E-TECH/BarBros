import { BaseEntity } from 'src/common/database/baseEntity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from 'src/modules/user/entities/user.admin,entity';

@Entity('notifications')
export class NotificationEntity extends BaseEntity {
  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'boolean' })
  is_read: boolean;

  @Column({ type: 'bigint' })
  user_id: number;

  @ManyToOne(() => UserEntity, (user) => user.notifikation, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}

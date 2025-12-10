import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({
    name: 'created_at',
    type: 'bigint',
    default: () => '(EXTRACT(epoch FROM NOW()) * 1000)::bigint',
  })
  created_at: number;

  @Column({
    name: 'updated_at',
    type: 'bigint',
    default: () => '(EXTRACT(epoch FROM NOW()) * 1000)::bigint',
  })
  updated_at: number;

  @Column({
    name: 'modified_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  modified_at: Date;

  @Column({
    name: 'created_by',
    type: 'bigint',
    nullable: true,
  })
  created_by: number;

  @Column({
    name: 'modified_by',
    type: 'bigint',
    nullable: true,
  })
  modified_by: number;

  @Column({
    name: 'is_deleted',
    type: 'boolean',
    default: false,
  })
  is_deleted: boolean;
}

import { BaseEntity } from 'src/common/database/baseEntity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BarberShopEntity } from './barber-shop.entity';

@Entity('images')
export class ImageEntity extends BaseEntity {
  @Column({ type: 'bigint' })
  barberShop_id: number;

  @Column({ type: 'varchar' })
  img: string;

  @ManyToOne(() => BarberShopEntity, (barberShop) => barberShop.images, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'barberShop_id' })
  barberShop: BarberShopEntity;
}

import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/common/database/baseEntity';
import { ServiceEntity } from 'src/modules/service/entities/service.entity';
import { BarberShopEntity } from 'src/modules/barber-shop/entities/barber-shop.entity';

@Entity('service_images')
export class ServiceImageEntity extends BaseEntity {
  @Column({ type: 'bigint' })
  service_id: number;

  @Column({ type: 'bigint' })
  barber_shop_id: number;

  @Column({ type: 'varchar' })
  image: string;

  @ManyToOne(() => ServiceEntity, (service) => service.serviceImages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'service_id' })
  service: ServiceEntity;

  @ManyToOne(() => BarberShopEntity, (shop) => shop.serviceImages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'barber_shop_id' })
  barberShop: BarberShopEntity;
}

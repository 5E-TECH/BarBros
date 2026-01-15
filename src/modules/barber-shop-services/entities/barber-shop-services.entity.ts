import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/common/database/baseEntity';
import { BarberShopEntity } from 'src/modules/barber-shop/entities/barber-shop.entity';
import { ServiceEntity } from 'src/modules/service/entities/service.entity';

@Entity('barber_shop_services')
export class BarberShopServicesEntity extends BaseEntity {
  @Column({ type: 'int' })
  barber_shop_id: number;

  @Column({ type: 'int' })
  service_id: number;

  @Column({ type: 'int' })
  price: number;

  @ManyToOne(() => BarberShopEntity, (shop) => shop.barberShopServices, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'barber_shop_id' })
  barberShop: BarberShopEntity;

  @ManyToOne(() => ServiceEntity, (service) => service.barberShopServices, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'service_id' })
  service: ServiceEntity;
}

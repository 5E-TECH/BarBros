import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { BaseEntity } from 'src/common/database/baseEntity';
import { BookingEntity } from 'src/modules/booking/entities/booking.entity';
import { BarberEntity } from '../../barber/entities/barber.entity';
import { CategoryEntitiy } from 'src/modules/category/entitiy/category.entitiy';
import { BarberShopServicesEntity } from 'src/modules/barber-shop-services/entities/barber-shop-services.entity';
import { ServiceImageEntity } from 'src/modules/service-image/entities/service-image.entity';

@Entity('services')
export class ServiceEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'int', default: 30 })
  duration_minutes: number;

  // @Column()
  // barber_id: number;

  @OneToMany(() => BookingEntity, (booking) => booking.service)
  booking: BookingEntity[];

  @ManyToMany(() => BarberEntity, (barber) => barber.service)
  @JoinTable({
    name: 'barber_services',
    joinColumn: { name: 'service_id' },
    inverseJoinColumn: { name: 'barber_id' },
  })
  barbers: BarberEntity[];

  @ManyToOne(() => CategoryEntitiy, (category) => category.services, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntitiy;

  @OneToMany(
    () => BarberShopServicesEntity,
    (barberShopService) => barberShopService.service,
  )
  barberShopServices: BarberShopServicesEntity[];

  @OneToMany(() => ServiceImageEntity, (image) => image.service)
  serviceImages: ServiceImageEntity[];

  // @Column({ type: 'int', nullable: true })
  // category_id: number;
}

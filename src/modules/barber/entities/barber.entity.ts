import { BaseEntity } from 'src/common/database/baseEntity';
import { BarberRole } from 'src/common/enum';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ReytingEntity } from 'src/modules/rayting/entities/reyting.entity';
import { BookingEntity } from 'src/modules/booking/entities/booking.entity';
import { BarberImageEntity } from 'src/modules/barber_images/entities/barber_image.entity';
import { BarberScheduleEntity } from 'src/modules/barber_schedule/entities/barber_schedule.entity';
import { BarberShopEntity } from 'src/modules/barber-shop/entities/barber-shop.entity';
import { ServiceEntity } from '../../service/entities/service.entity';

@Entity('barber')
export class BarberEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  full_name: string;

  @Column({ type: 'varchar' })
  phone_number: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'text' })
  bio: string;

  @Column({ type: 'varchar', default: BarberRole.BARBER })
  role: BarberRole.BARBER;

  @Column({ type: 'decimal', default: 0 })
  avg_reyting: number;

  @Column({ type: 'text', default: null })
  img: string | null;

  @Column({ type: 'varchar' })
  barberShop_id: number;

  @Column({ type: 'boolean', default: false })
  is_avaylbl: boolean;

  @OneToMany(()=> ReytingEntity, (reyting)=> reyting.barber)
  reyting: ReytingEntity[]

  @OneToMany(()=> BookingEntity, (booking)=> booking.barber)
  booking: BookingEntity[]

  @OneToMany(()=> BarberImageEntity, (barberImage)=> barberImage.barber)
  barberImage: BarberImageEntity[]

  @OneToMany(()=> BarberScheduleEntity, (barberSchuld)=> barberSchuld.barber)
  barberSchuld: BarberScheduleEntity[]

  @ManyToOne(()=> BarberShopEntity, (barberShop)=> barberShop.barber,{
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
  })
  @JoinColumn({name: "barberShop_id"})
  barberShop: BarberShopEntity

  @OneToMany(()=> ServiceEntity, (service)=>service.barber)
  service: ServiceEntity[]
}

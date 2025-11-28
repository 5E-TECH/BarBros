import { BaseEntity } from 'src/common/database/baseEntity';
import { Column, Entity, OneToMany } from 'typeorm';
import { BarberEntity } from './barber.entity';
import { ImageEntity } from './image.entity';
import { ServiceEntity } from './service.entity';
import { BarberRole } from 'src/common/enum';

@Entity()
export class BarberShopEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  location: string;

  @Column({ type: 'varchar',default: null })
  img: string | null

  @Column({ type: 'varchar' })
  descripton: string;

  @Column({ type: 'varchar' })
  phoneNumber: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({type: "varchar"})
  email: string

  @Column({type:"varchar", default: BarberRole.BARBER_SHOP})
  role: BarberRole.BARBER_SHOP

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @OneToMany(()=> BarberEntity, (barber)=> barber.barberShop)
  barber: BarberEntity[]

  @OneToMany(()=> ImageEntity, (image)=> image.barberShop)
  images: ImageEntity[]
  
}

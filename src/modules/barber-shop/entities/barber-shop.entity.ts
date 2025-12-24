import { BaseEntity } from 'src/common/database/baseEntity';
import { Column, Entity, OneToMany } from 'typeorm';
import { BarberEntity } from 'src/modules/barber/entities/barber.entity';
import { ImageEntity } from 'src/modules/images/entities/image.entity';
import { ServiceEntity } from 'src/modules/service/entities/service.entity';
import { BarberRole, Status } from 'src/common/enum';

@Entity()
export class BarberShopEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  location: string;

  @Column({ type: 'varchar', default: null })
  img: string | null;

  @Column({ type: 'varchar' })
  descripton: string;

  @Column({ type: 'varchar' })
  phoneNumber: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar', unique: true })
  username: string;

  @Column({ type: 'varchar', default: BarberRole.BARBER_SHOP })
  role: BarberRole.BARBER_SHOP;

  @Column({ type: 'enum', enum: Status, default: Status.INACTIVE })
  status: Status;

  @OneToMany(() => BarberEntity, (barber) => barber.barberShop)
  barber: BarberEntity[];

  @OneToMany(() => ImageEntity, (image) => image.barberShop)
  images: ImageEntity[];

  @OneToMany(() => ServiceEntity, (service) => service.barberShop)
  services: ServiceEntity[];
}

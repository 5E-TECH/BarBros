import { BaseEntity } from 'src/common/database/baseEntity';
import { Column, Entity } from 'typeorm';

@Entity('sub-category')
export class SubCategoryEntitiy extends BaseEntity {
  @Column({ nullable: true })
  name: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'varchar' })
  img: string;

  // @ManyToOne(() => ServiceEntity, (service) => service.category)
  // services: ServiceEntity[];
}

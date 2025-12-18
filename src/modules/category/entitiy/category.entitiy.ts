import { BaseEntity } from 'src/common/database/baseEntity';
import { Category } from 'src/common/enum';
import { ServiceEntity } from 'src/modules/service/entities/service.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('category')
export class CategoryEntitiy extends BaseEntity {
  @Column({ nullable: true})
  name: string;

  @Column({type:'varchar'})
  img:string

  @Column({type:"enum", enum:Category})
  categoryType:Category

  // CategoryEntity
  @OneToMany(() => ServiceEntity, (service) => service.category)
  services: ServiceEntity[];
}

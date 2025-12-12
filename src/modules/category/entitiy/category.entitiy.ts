import { BaseEntity } from "src/common/database/baseEntity";
import { ServiceEntity } from "src/modules/service/entities/service.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('category')
export class CategoryEntitiy extends BaseEntity{
    @Column({nullable:true, unique:true})
    name:string


    @OneToMany(()=>ServiceEntity, service => service.category)
    services:ServiceEntity[];
    
}
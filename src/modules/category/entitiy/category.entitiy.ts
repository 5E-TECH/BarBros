import { ServiceEntity } from "src/modules/service/entities/service.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('category')
export class CategoryEntitiy{
    @PrimaryGeneratedColumn()
    id:number

    @Column({nullable:true})
    name:string


    @OneToMany(()=>ServiceEntity, service => service.category)
    services:ServiceEntity[];
    
}
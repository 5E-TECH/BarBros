import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntitiy } from './entitiy/category.entitiy';
import { ServiceEntity } from '../service/entities/service.entity';

@Module({
  imports:[TypeOrmModule.forFeature([CategoryEntitiy,ServiceEntity])],
  controllers: [CategoryController],
  providers: [CategoryService]
})
export class CategoryModule {}

import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntitiy } from './entitiy/category.entitiy';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntitiy])],
  controllers: [CategoryController],
  providers: [CategoryService]
})
export class CategoryModule {}

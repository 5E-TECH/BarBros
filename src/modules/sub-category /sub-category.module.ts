import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubCategoryEntitiy } from './entitiy/sub-category.entitiy';
import { SubCategoryController } from './sub-category.controller';
import { SubCategoryService } from './sub-category.service';

@Module({
  imports:[TypeOrmModule.forFeature([SubCategoryEntitiy,])],
  controllers: [SubCategoryController],
  providers: [SubCategoryService]
})
export class CategoryModule {}

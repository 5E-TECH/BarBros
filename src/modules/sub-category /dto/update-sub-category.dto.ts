import { PartialType } from '@nestjs/swagger';
import { CreateSubCategoryDto } from './sub-category.dto';

export class UpdateSubCategoryDto extends PartialType(CreateSubCategoryDto) {}
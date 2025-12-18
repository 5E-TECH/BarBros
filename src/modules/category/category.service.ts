import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntitiy } from './entitiy/category.entitiy';
import { ILike, Repository } from 'typeorm';
import { ErrorHender } from 'src/utils/catchError';
import { CreateCategoryDto } from './dto/category.dto';
import { successRes } from 'src/utils/succesResponse';
import { ImageValidationPipe } from 'src/common/pipe/img-validation';
import { FileService } from '../file/file.service';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntitiy)
    private categoryRepo: Repository<CategoryEntitiy>,
    private readonly fileServis: FileService,
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
    file?: Express.Multer.File,
  ) {
    try {
      const { name, categoryType } = createCategoryDto;

      const existCategory = await this.categoryRepo.findOne({
        where: {
          name: ILike(name),
          categoryType: categoryType,
        },
      });

      if (existCategory) {
        throw new ConflictException(
          'Category with this name and type already exists!',
        );
      }
      const category = this.categoryRepo.create(createCategoryDto);

      if (file && new ImageValidationPipe().transform(file)) {
        const img = await this.fileServis.createFile(file);
        category.img = img;
      }

      await this.categoryRepo.save(category);
      return successRes(category, 201);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async getAllCategory() {
    try {
      const category = await this.categoryRepo.find();
      return successRes(category);
    } catch (error) {
      return ErrorHender(error);
    }
  }
}

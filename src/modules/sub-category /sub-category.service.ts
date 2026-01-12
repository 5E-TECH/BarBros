import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubCategoryEntitiy } from './entitiy/sub-category.entitiy';
import { ILike, Repository } from 'typeorm';
import { FileService } from '../file/file.service';
import { CreateSubCategoryDto } from './dto/sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { ErrorHender } from 'src/utils/catchError';
import { successRes } from 'src/utils/succesResponse';
import { ImageValidationPipe } from 'src/common/pipe/img-validation';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectRepository(SubCategoryEntitiy)
    private subcategoryRepo: Repository<SubCategoryEntitiy>,
    private readonly fileServis: FileService,
  ) {}

  async createSubCategory(createSubCategoryDto: CreateSubCategoryDto, file?: Express.Multer.File) {
    try {
      const { name } = createSubCategoryDto;

      const exist = await this.subcategoryRepo.findOne({ where: { name: ILike(name) } });
      if (exist) throw new ConflictException('SubCategory already exists!');

      const subCategory = this.subcategoryRepo.create(createSubCategoryDto);

      if (file && new ImageValidationPipe().transform(file)) {
        subCategory.img = await this.fileServis.createFile(file);
      }

      const saved = await this.subcategoryRepo.save(subCategory);
      return successRes(saved, 201);
    } catch (error) {
      ErrorHender(error);
    }
  }

  async findAll() {
    try {
      const data = await this.subcategoryRepo.find();
      return successRes(data);
    } catch (error) {
      ErrorHender(error);
    }
  }

  async findOne(id: number) {
    try {
      const data = await this.subcategoryRepo.findOne({ where: { id } });
      if (!data) throw new NotFoundException('SubCategory not found');
      return successRes(data);
    } catch (error) {
      ErrorHender(error);
    }
  }

  async update(id: number, updateDto: UpdateSubCategoryDto, file?: Express.Multer.File) {
    try {
      const subCategory = await this.subcategoryRepo.findOne({ where: { id } });
      if (!subCategory) throw new NotFoundException('Not found');

      if (file && new ImageValidationPipe().transform(file)) {
        subCategory.img = await this.fileServis.createFile(file);
      }

      Object.assign(subCategory, updateDto);
      const updated = await this.subcategoryRepo.save(subCategory);
      return successRes(updated);
    } catch (error) {
      ErrorHender(error);
    }
  }

  async remove(id: number) {
    try {
      const result = await this.subcategoryRepo.delete(id);
      if (result.affected === 0) throw new NotFoundException('Not found');
      return successRes({ message: 'Deleted successfully' });
    } catch (error) {
      ErrorHender(error);
    }
  }
}
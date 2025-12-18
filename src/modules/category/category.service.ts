import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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
      const { name } = createCategoryDto;

      const existName = await this.categoryRepo.findOne({
        where: { name: ILike(name) },
      });
      if (existName)
        throw new ConflictException('category name already exists!');

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



  async updateCategory(){
    try {
      
    } catch (error) {
     return ErrorHender(error)
      
    }
  }


  async deletCategory(id:number){
    try {
      const category = await this.categoryRepo.findOne({where:{id}})
      if(!category) throw new NotFoundException("Not found category")

        const categorys = await this.categoryRepo.remove(category)
        return successRes(categorys)

    } catch (error) {
      ErrorHender(error)
      
    }
  }



  
}

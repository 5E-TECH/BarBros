import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntitiy } from './entitiy/category.entitiy';
import { ILike, Repository } from 'typeorm';
import { ErrorHender } from 'src/utils/catchError';
import { CreateCategoryDto } from './dto/category.dto';
import { successRes } from 'src/utils/succesResponse';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(CategoryEntitiy)
        private categoryRepo: Repository<CategoryEntitiy> 
    ) {}

    async createCategory(createCategoryDto:CreateCategoryDto){
        try {
            const {name} = createCategoryDto
            const existName = await this.categoryRepo.findOne({where:{name: ILike(name)}})
            if(existName) throw new ConflictException("category name already exists!")
            
            const category = this.categoryRepo.create(createCategoryDto)
            await this.categoryRepo.save(category)
            return successRes(category, 201)
        } catch (error) {
            return ErrorHender(error)
        }
    }

    async getAllCategory(){
        try {
            const category = await this.categoryRepo.find()
            return successRes(category)
        } catch (error) {
            return ErrorHender(error)
        }
    }

    
}

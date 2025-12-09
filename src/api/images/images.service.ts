import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageEntity } from 'src/core/entity/image.entity';
import { DataSource, Repository } from 'typeorm';
import { FileService } from '../file/file.service';
import { ErrorHender } from 'src/infrostructure/utils/catchError';
import { successRes } from 'src/infrostructure/utils/succesResponse';
import { ImageValidationPipe } from 'src/common/pipe/img-validation';
import { Request } from 'express';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(ImageEntity)
    private readonly imageRepo: Repository<ImageEntity>,
    private readonly fileService: FileService,
    private readonly dataSource: DataSource
  ) {}

  async create(
    files: Express.Multer.File[],
    req: Request,
  ) {
    const userId = req['user'].id;
  
    if (!files || files.length === 0) {
      throw new BadRequestException("Hech qanday rasm topilmadi");
    }
  
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
  
    try {
      for (const file of files) {
        new ImageValidationPipe().transform(file);
        const img = await this.fileService.createFile(file);
  
        const imageEntity = this.imageRepo.create({
          barberShop_id: userId,
          img,
        });
  
        await queryRunner.manager.save(imageEntity);
      }
      await queryRunner.commitTransaction();
  
      const uploadedImages = await this.imageRepo.find({
        where: { barberShop_id: userId },
      });
  
      return successRes(uploadedImages, 201);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return ErrorHender(error);
    } finally {
      await queryRunner.release();
    }
  }
  

  async findAll() {
    try {
      const images = await this.imageRepo.find();
      if (!images.length) {
        throw new NotFoundException('Images not found');
      }
      return successRes(images);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async findAllBarber(req: Request) {
    try {
      const images = await this.imageRepo.find({
        where: { barberShop_id: req['user'].id },
      });
      if (!images.length) {
        throw new NotFoundException('Images not found');
      }
      return successRes(images);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async remove(id: string, req: Request) {
    try {
      const image = await this.imageRepo.findOne({ where: { id } });
      if (!image) {
        throw new NotFoundException('Image not found');
      }
      if(image.barberShop_id !== req["user"].id){
        throw new ForbiddenException("Siz Boshqa barberShop rasmini o'chira ilmaysiz")
      }
      const data = await this.imageRepo.remove(image);
      if (await this.fileService.existFile(image.img)) {
        await this.fileService.deleteFile(image.img);
      }
      return successRes(data);
    } catch (error) {
      return ErrorHender(error);
    }
  }
}

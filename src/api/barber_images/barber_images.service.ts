import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBarberImageDto } from './dto/create-barber_image.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BarberImageEntity } from 'src/core/entity/barber_image.entity';
import {DataSource, Repository } from 'typeorm';
import { FileService } from '../file/file.service';
import { ErrorHender } from 'src/infrostructure/utils/catchError';
import { ImageValidationPipe } from 'src/common/pipe/img-validation';
import { successRes } from 'src/infrostructure/utils/succesResponse';
import { Request } from 'express';

@Injectable()
export class BarberImagesService {
  constructor(
    @InjectRepository(BarberImageEntity)
    private readonly barberImg: Repository<BarberImageEntity>,
    private readonly fileService: FileService,
    private readonly dataSource: DataSource
  ) {}


  async create(
    createBarberImageDto: CreateBarberImageDto,
    files: Express.Multer.File[],
    req: Request,
  ) {
    const userId = req['user'].id;
  
    if (userId !== createBarberImageDto.barber_id) {
      throw new ForbiddenException("Boshqa barber uchun image qo'sha olmaysiz");
    }
  
    if (!files || !files.length) {
      throw new BadRequestException("Hech qanday rasm topilmadi");
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
  
    try {
      for (const file of files) {
        new ImageValidationPipe().transform(file);
        const img = await this.fileService.createFile(file);
        const data = this.barberImg.create({
          barber_id: createBarberImageDto.barber_id,
          img,
        });
  
        await queryRunner.manager.save(data);
      }
  
      await queryRunner.commitTransaction();

      const newdata = await this.barberImg.find({
        where: { barber_id: createBarberImageDto.barber_id },
      });
  
      return successRes(newdata, 201);
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
  
  async findAll() {
    try {
      const data = await this.barberImg.find();
      if (!data.length) {
        throw new NotFoundException('Not fount Barber image');
      }
      return successRes(data);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async findAllBarberImg(req: Request) {
    try {
      const data = await this.barberImg.find({
        where: { barber_id: req['user'].id },
      });
      if (!data.length) {
        throw new NotFoundException('Not Fount image');
      }
      return successRes(data);
    } catch (error) {
      return ErrorHender(error);
    }
  }
  async remove(id: number, req: Request) {
    try {
      const data = await this.barberImg.findOneBy({ id });
      if (!data) {
        throw new NotFoundException('Not fount Barber image');
      }
      if (req['user'].id !== data.barber_id) {
      }
      const delet = await this.barberImg.remove(data);
      if (await this.fileService.existFile(data.img)) {
        await this.fileService.deleteFile(data.img);
      }
      return successRes(delet);
    } catch (error) {
      return ErrorHender(error);
    }
  }
}

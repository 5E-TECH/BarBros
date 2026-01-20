import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceImageEntity } from './entities/service-image.entity';
import { CreateServiceImageDto } from './dto/create-service-image.dto';
import { ErrorHender } from 'src/utils/catchError';
import { successRes } from 'src/utils/succesResponse';
import { Request } from 'express';
import { UserRole } from 'src/common/enum';
import { FileService } from 'src/modules/file/file.service';
import { ImageValidationPipe } from 'src/common/pipe/img-validation';
import { ServiceEntity } from 'src/modules/service/entities/service.entity';
import { BarberShopEntity } from 'src/modules/barber-shop/entities/barber-shop.entity';
import { BarberShopServicesEntity } from 'src/modules/barber-shop-services/entities/barber-shop-services.entity';

@Injectable()
export class ServiceImageService {
  constructor(
    @InjectRepository(ServiceImageEntity)
    private readonly imageRepo: Repository<ServiceImageEntity>,
    @InjectRepository(ServiceEntity)
    private readonly serviceRepo: Repository<ServiceEntity>,
    @InjectRepository(BarberShopEntity)
    private readonly shopRepo: Repository<BarberShopEntity>,
    @InjectRepository(BarberShopServicesEntity)
    private readonly shopServiceRepo: Repository<BarberShopServicesEntity>,
    private readonly fileService: FileService,
  ) {}

  async create(
    dto: CreateServiceImageDto,
    req: Request,
    file?: Express.Multer.File,
  ) {
    try {
      if (!file) {
        throw new BadRequestException('image is required');
      }

      const user = req['user'];
      let barberShopId = dto.barber_shop_id;

      if (user.role === UserRole.SUPPER_ADMIN || user.role === UserRole.ADMIN) {
        if (!barberShopId) {
          throw new BadRequestException('barber_shop_id is required');
        }
      } else {
        throw new ForbiddenException('Access denied');
      }

      const [service, shop] = await Promise.all([
        this.serviceRepo.findOne({ where: { id: dto.service_id } }),
        this.shopRepo.findOne({ where: { id: barberShopId } }),
      ]);

      if (!service) throw new NotFoundException('Service not found');
      if (!shop) throw new NotFoundException('BarberShop not found');

      const link = await this.shopServiceRepo.findOne({
        where: {
          barber_shop_id: barberShopId,
          service_id: dto.service_id,
        },
      });
      if (!link) {
        throw new BadRequestException('Service not offered by this shop');
      }

      new ImageValidationPipe().transform(file);
      const image = await this.fileService.createFile(file);

      const entity = this.imageRepo.create({
        service_id: dto.service_id,
        barber_shop_id: barberShopId,
        image,
      });

      const saved = await this.imageRepo.save(entity);
      return successRes(saved, 201);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async findByService(serviceId: number) {
    try {
      const data = await this.imageRepo.find({
        where: { service_id: serviceId },
      });
      return successRes(data);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async remove(id: number, req: Request) {
    try {
      const data = await this.imageRepo.findOne({ where: { id } });
      if (!data) throw new NotFoundException('Image not found');

      const user = req['user'];
      if (user.role !== UserRole.SUPPER_ADMIN && user.role !== UserRole.ADMIN) {
        throw new ForbiddenException('Access denied');
      }

      await this.imageRepo.remove(data);
      if (await this.fileService.existFile(data.image)) {
        await this.fileService.deleteFile(data.image);
      }
      return successRes(data);
    } catch (error) {
      return ErrorHender(error);
    }
  }
}

import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BarberShopServicesEntity } from './entities/barber-shop-services.entity';
import { BarberShopEntity } from 'src/modules/barber-shop/entities/barber-shop.entity';
import { ServiceEntity } from 'src/modules/service/entities/service.entity';
import { CreateBarberShopServiceDto } from './dto/create-barber-shop-service.dto';
import { UpdateBarberShopServiceDto } from './dto/update-barber-shop-service.dto';
import { ErrorHender } from 'src/utils/catchError';
import { successRes } from 'src/utils/succesResponse';
import { UserRole } from 'src/common/enum';
import { Request } from 'express';

@Injectable()
export class BarberShopServicesService {
  constructor(
    @InjectRepository(BarberShopServicesEntity)
    private readonly barberShopServiceRepo: Repository<BarberShopServicesEntity>,
    @InjectRepository(BarberShopEntity)
    private readonly barberShopRepo: Repository<BarberShopEntity>,
    @InjectRepository(ServiceEntity)
    private readonly serviceRepo: Repository<ServiceEntity>,
  ) {}

  private resolveBarberShopId(
    dtoBarberShopId: number | undefined,
    req: Request,
  ) {
    const user = req['user'];
    if (user.role === UserRole.SP_ADMIN) {
      if (dtoBarberShopId && dtoBarberShopId !== user.id) {
        throw new ForbiddenException('Cannot use another barber shop id');
      }
      return user.id;
    }

    if (user.role === UserRole.SUPPER_ADMIN || user.role === UserRole.ADMIN) {
      if (!dtoBarberShopId) {
        throw new BadRequestException('barber_shop_id is required');
      }
      return dtoBarberShopId;
    }

    throw new ForbiddenException('Access denied');
  }

  async create(dto: CreateBarberShopServiceDto, req: Request) {
    try {
      const barberShopId = this.resolveBarberShopId(dto.barber_shop_id, req);

      const [shop, service] = await Promise.all([
        this.barberShopRepo.findOne({ where: { id: barberShopId } }),
        this.serviceRepo.findOne({ where: { id: dto.service_id } }),
      ]);

      if (!shop) throw new NotFoundException('BarberShop not found');
      if (!service) throw new NotFoundException('Service not found');

      const exists = await this.barberShopServiceRepo.findOne({
        where: {
          barber_shop_id: barberShopId,
          service_id: dto.service_id,
        },
      });
      if (exists)
        throw new ConflictException('Service already attached to this shop');

      const entity = this.barberShopServiceRepo.create({
        barber_shop_id: barberShopId,
        service_id: dto.service_id,
        price: dto.price,
        duration_minutes: dto.duration_minutes,
        barberShop: { id: barberShopId },
        service: { id: dto.service_id },
      });

      const saved = await this.barberShopServiceRepo.save(entity);
      const result = await this.barberShopServiceRepo.findOne({
        where: { id: saved.id },
        relations: ['barberShop', 'service'],
      });

      return successRes(result, 201);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async findAll(req: Request) {
    try {
      const user = req['user'];
      const where =
        user.role === UserRole.SP_ADMIN
          ? { barber_shop_id: user.id }
          : {};

      const data = await this.barberShopServiceRepo.find({
        where,
        relations: ['barberShop', 'service'],
      });

      if (!data.length) {
        throw new NotFoundException('BarberShop services not found');
      }

      return successRes(data);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async findOne(id: number, req: Request) {
    try {
      const data = await this.barberShopServiceRepo.findOne({
        where: { id },
        relations: ['barberShop', 'service'],
      });
      if (!data) throw new NotFoundException('BarberShop service not found');

      const user = req['user'];
      if (user.role === UserRole.SP_ADMIN && data.barber_shop_id !== user.id) {
        throw new ForbiddenException('Access denied');
      }

      return successRes(data);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async update(id: number, dto: UpdateBarberShopServiceDto, req: Request) {
    try {
      const data = await this.barberShopServiceRepo.findOne({ where: { id } });
      if (!data) throw new NotFoundException('BarberShop service not found');

      const user = req['user'];
      let barberShopId = data.barber_shop_id;

      if (user.role === UserRole.SP_ADMIN) {
        if (dto.barber_shop_id && dto.barber_shop_id !== user.id) {
          throw new ForbiddenException('Cannot change barber shop id');
        }
        if (data.barber_shop_id !== user.id) {
          throw new ForbiddenException('Access denied');
        }
        barberShopId = user.id;
      } else if (
        user.role === UserRole.SUPPER_ADMIN ||
        user.role === UserRole.ADMIN
      ) {
        if (dto.barber_shop_id) {
          const shop = await this.barberShopRepo.findOne({
            where: { id: dto.barber_shop_id },
          });
          if (!shop) throw new NotFoundException('BarberShop not found');
          barberShopId = dto.barber_shop_id;
        }
      } else {
        throw new ForbiddenException('Access denied');
      }

      if (dto.service_id) {
        const service = await this.serviceRepo.findOne({
          where: { id: dto.service_id },
        });
        if (!service) throw new NotFoundException('Service not found');
      }

      const serviceId = dto.service_id ?? data.service_id;
      const duplicate = await this.barberShopServiceRepo.findOne({
        where: {
          barber_shop_id: barberShopId,
          service_id: serviceId,
        },
      });
      if (duplicate && duplicate.id !== data.id) {
        throw new ConflictException('Service already attached to this shop');
      }

      await this.barberShopServiceRepo.update(id, {
        ...dto,
        barber_shop_id: barberShopId,
      });

      const result = await this.barberShopServiceRepo.findOne({
        where: { id },
        relations: ['barberShop', 'service'],
      });

      return successRes(result);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async remove(id: number, req: Request) {
    try {
      const data = await this.barberShopServiceRepo.findOne({ where: { id } });
      if (!data) throw new NotFoundException('BarberShop service not found');

      const user = req['user'];
      if (user.role === UserRole.SP_ADMIN && data.barber_shop_id !== user.id) {
        throw new ForbiddenException('Access denied');
      }
      if (
        ![
          UserRole.SP_ADMIN,
          UserRole.SUPPER_ADMIN,
          UserRole.ADMIN,
        ].includes(user.role)
      ) {
        throw new ForbiddenException('Access denied');
      }

      const deleted = await this.barberShopServiceRepo.remove(data);
      return successRes(deleted);
    } catch (error) {
      return ErrorHender(error);
    }
  }
}

import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ForbiddenException,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServiceEntity } from './entities/service.entity';
import { ErrorHender } from 'src/utils/catchError';
import { successRes } from 'src/utils/succesResponse';
import { Request } from 'express';
import { BarberEntity } from '../barber/entities/barber.entity';
import { AddBarbersToServiceDto } from './dto/addbarbertoservice.dto';
import { UserRole } from 'src/common/enum';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(ServiceEntity)
    private readonly serviceRepository: Repository<ServiceEntity>,
    @InjectRepository(BarberEntity)
    private readonly barberRepository: Repository<BarberEntity>,
  ) {}
  async creates(createServiceDto: CreateServiceDto, barbershop_id: number) {
    try {
      const { barber_ids, category_id, ...serviceData } = createServiceDto;

 
      const barbers = await this.barberRepository.find({
        where: { id: In(barber_ids), barberShop: { id: barbershop_id } },
      });

      if (barbers.length !== barber_ids.length) {
        throw new BadRequestException(
          'Some barber ids are invalid or do not belong to your shop',
        );
      }

      const service = this.serviceRepository.create({
        ...serviceData,
        category: { id: category_id },
        barberShop: { id: barbershop_id },
        barbers,
      });

      await this.serviceRepository.save(service);

      return successRes(service, 201);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async addBarbersToService(
    dto: AddBarbersToServiceDto,
    currentShopId: number,
  ) {
    const { service_id, barber_ids } = dto;

    const service = await this.serviceRepository.findOne({
      where: { id: service_id },
      relations: ['barbers'],
    });

    if (!service) throw new NotFoundException('Service not found');

    const newBarbers = await this.barberRepository.find({
      where: { id: In(barber_ids), barberShop: { id: currentShopId } },
    });

    if (newBarbers.length !== barber_ids.length) {
      throw new BadRequestException(
        'Some barber ids are invalid or do not belong to your shop',
      );
    }

    const existingIds = service.barbers.map((b) => b.id);
    const barbersToAdd = newBarbers.filter((b) => !existingIds.includes(b.id));

    service.barbers.push(...barbersToAdd);

    await this.serviceRepository.save(service);

    return successRes(service, 200);
  }

  async findAll() {
    try {
      const data = await this.serviceRepository.find({
        relations: ['booking', 'barbers', 'barberShop'],
      });
      if (!data.length) {
        throw new NotFoundException('Not Fount service');
      }
      return successRes(data);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async findOne(id: number) {
    try {
      const service = await this.serviceRepository.findOne({
        where: { id: id },
        relations: ['booking', 'barbers', 'barberShop'],
      });
      if (!service) {
        throw new NotFoundException('Not Fount service');
      }
      return successRes(service);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async findAllMyServices(user: any) {
    try {
      let data;

      if (user.role === UserRole.SP_ADMIN) {
        data = await this.serviceRepository.find({
          where: {
            barberShop: { id: user.id },
          },
          relations: ['barbers'],
        });
      }

      else if (user.role === UserRole.BARBER) {
        data = await this.serviceRepository
          .createQueryBuilder('service')
          .leftJoin('service.barbers', 'barber')
          .where('barber.id = :barberId', { barberId: user.id })
          // .leftJoinAndSelect('service.barbers', 'barbers')
          .getMany();
      } else {
        throw new ForbiddenException('Access denied');
      }

      if (!data || !data.length) {
        throw new NotFoundException('Not Found service');
      }

      return successRes(data);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async update(id: number, updateServiceDto: UpdateServiceDto, req: Request) {
    try {
      const data = await this.serviceRepository.findOneBy({ id });
      if (!data) {
        throw new NotFoundException('Nor fount service');
      }
      // if(data.barber_id !== req["user"].id){
      //   throw new ForbiddenException("Siz boshqa barber servisini o'zgartira olmaysiz")
      // }
      await this.serviceRepository.update(data.id, { ...updateServiceDto });
      const newData = await this.serviceRepository.findOne({
        where: { id: data.id },
      });
      return successRes(newData);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async remove(id: number, req: Request) {
    try {
      const service = await this.serviceRepository.findOneBy({ id });
      if (!service) {
        throw new NotFoundException('Not fount service');
      }
      // if(service.barber_id !== req["user"].id){
      //   throw new ForbiddenException("Siz boshqa barber servislarini o'zgartira olmaysiz")
      // }
      const data = await this.serviceRepository.remove(service);
      return successRes(data);
    } catch (error) {
      return ErrorHender(error);
    }
  }
}

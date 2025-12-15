import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ForbiddenException,
  BadRequestException,
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

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(ServiceEntity)
    private readonly serviceRepository: Repository<ServiceEntity>,
    @InjectRepository(BarberEntity)
    private readonly barberRepository: Repository<BarberEntity>
  ) {}
  async creates(createServiceDto: CreateServiceDto, req: Request) {
  try {
    const {
      barber_ids,
      category_id,
      ...serviceData
    } = createServiceDto;

    // 1️⃣ barberlarni topamiz
    const barbers = await this.barberRepository.find({
      where: { id: In(barber_ids) },
    });

    if (barbers.length !== barber_ids.length) {
      throw new BadRequestException('Some barber ids are invalid');
    }

    // 2️⃣ service yaratamiz
    const service = this.serviceRepository.create({
      ...serviceData,
      category: { id: category_id },
      barbers, // 🔥 MANY TO MANY
    });

    // 3️⃣ saqlaymiz
    await this.serviceRepository.save(service);

    return successRes(service, 201);
  } catch (error) {
    return ErrorHender(error);
  }
}


  async findAll() {
    try {
      const data = await this.serviceRepository.find({relations:["booking","barber"]});
      if(!data.length){
        throw new NotFoundException("Not Fount service")
      }
      return successRes(data);
    } catch (error) {
     return ErrorHender(error);
    }
  }

  async findOne(id: number) {
    try {
      const service = await this.serviceRepository.findOne({where:{id:id},relations:["booking","barber"] });
      if (!service) {
        throw new NotFoundException("Not Fount service");
      }
      return successRes(service)
    } catch (error) {
     return ErrorHender(error)
    }
  }

  async update(id: number, updateServiceDto: UpdateServiceDto, req: Request) {
    try {
      const data = await this.serviceRepository.findOneBy({ id });
      if(!data){
        throw new NotFoundException("Nor fount service")
      }
      // if(data.barber_id !== req["user"].id){
      //   throw new ForbiddenException("Siz boshqa barber servisini o'zgartira olmaysiz")
      // }
      await this.serviceRepository.update(data.id,{...updateServiceDto})
      const newData = await this.serviceRepository.findOne({where: {id: data.id}})
      return successRes(newData)
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async remove(id: number, req:Request) {
    try {
      const service = await this.serviceRepository.findOneBy({id});
      if(!service){
        throw new NotFoundException("Not fount service")
      }
      // if(service.barber_id !== req["user"].id){
      //   throw new ForbiddenException("Siz boshqa barber servislarini o'zgartira olmaysiz")
      // }
      const data = await this.serviceRepository.remove(service);
      return successRes(data)
    } catch (error) {
      return ErrorHender(error);
    }
  }
}

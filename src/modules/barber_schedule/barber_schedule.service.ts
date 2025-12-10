import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BarberScheduleEntity } from './entities/barber_schedule.entity';
import { CreateBarberScheduleDto } from './dto/create-barber_schedule.dto';
import { UpdateBarberScheduleDto } from './dto/update-barber_schedule.dto';
import { successRes } from 'src/utils/succesResponse';
import { ErrorHender } from 'src/utils/catchError';
import { Request } from 'express';

@Injectable()
export class BarberScheduleService {
  constructor(
    @InjectRepository(BarberScheduleEntity)
    private readonly scheduleRepo: Repository<BarberScheduleEntity>,
  ) {}

  async create(dto: CreateBarberScheduleDto, req: Request) {
    try {
      const schedule = this.scheduleRepo.create({
        ...dto,
        barber_id: req['user'].id,
      });
      this.scheduleRepo.save(schedule);
      return successRes(schedule, 201);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async findAll() {
    try {
      const data = await this.scheduleRepo.find();
      return successRes(data);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async findOne(id: number) {
    try {
      const data = await this.scheduleRepo.findOne({
        where: { id },
      });
      if (!data) throw new NotFoundException('Schedule not found');
      return successRes(data);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async update(id: number, dto: UpdateBarberScheduleDto, req: Request) {
    try {
      const schedule = await this.scheduleRepo.findOneBy({ id });
      if (!schedule) {
        throw new NotFoundException('Schedule not found');
      }
      if(schedule.barber_id !== req["user"].id){
        throw new ForbiddenException("Siz boshqa barber ish rejasini o'zgartira olmaysiz")
      }
      await this.scheduleRepo.update(id, dto);
      const updated = await this.scheduleRepo.findOne({ where: { id } });
      return successRes(updated);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async remove(id: number, req: Request) {
    try {
      const schedule = await this.scheduleRepo.findOneBy({ id });
      if (!schedule){
        throw new NotFoundException('Schedule not found');
      }
      if(schedule.barber_id !== req["user"].id){
        throw new ForbiddenException("Siz Boshqa barbenning ish rejasini o'zgartira olmaysiz")
      }
      await this.scheduleRepo.remove(schedule);
      return successRes({ message: 'Deleted successfully' });
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async getSchedulesByBarber(req: Request) {
    try {
      const schedules = await this.scheduleRepo.find({
        where: { barber_id: req['user'].id },
      });
      if (!schedules.length) {
        throw new NotFoundException('Not Fount barber schedule');
      }
      return successRes(schedules);
    } catch (error) {
      return ErrorHender(error);
    }
  }
}

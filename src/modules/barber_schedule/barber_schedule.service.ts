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

private generateTimeSlots(
  startTime: string,
  endTime: string,
  breakTime: number = 0,
): string[] {
  const slots: string[] = [];
  const SLOT = 30;

  let [sh, sm] = startTime.split(':').map(Number);
  let [eh, em] = endTime.split(':').map(Number);

  let current = sh * 60 + sm;
  const end = eh * 60 + em;

  let isFirstSlot = true;

  while (current <= end) {
    const hour = Math.floor(current / 60)
      .toString()
      .padStart(2, '0');
    const minute = (current % 60)
      .toString()
      .padStart(2, '0');

    slots.push(`${hour}:${minute}`);

    if (isFirstSlot && breakTime > 0) {
      current += SLOT + breakTime;
      isFirstSlot = false;
    } else {
      current += SLOT;
    }
  }

  return slots;
}


private getDaysBetween(startDay: string, endDay: string): string[] {
  const daysOfWeek = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];

  const startIndex = daysOfWeek.indexOf(startDay.toLowerCase());
  const endIndex = daysOfWeek.indexOf(endDay.toLowerCase());

  if (startIndex === -1 || endIndex === -1) {
    throw new Error('Invalid day name');
  }

  const days: string[] = [];
  
  if (startIndex <= endIndex) {
    // Normal case: monday to friday
    for (let i = startIndex; i <= endIndex; i++) {
      days.push(daysOfWeek[i]);
    }
  } else {
    // Wrap around case: friday to monday
    for (let i = startIndex; i < daysOfWeek.length; i++) {
      days.push(daysOfWeek[i]);
    }
    for (let i = 0; i <= endIndex; i++) {
      days.push(daysOfWeek[i]);
    }
  }

  return days;
}




async create(dto: CreateBarberScheduleDto, req: Request) {
  try {
    const slots = this.generateTimeSlots(
      dto.start_time,
      dto.end_time,
      dto.break_time,
    );

    const days = this.getDaysBetween(dto.start_day, dto.end_day);

    const schedules: Array<{
      day: string;
      schedule: BarberScheduleEntity;
      slots: string[];
    }> = [];

    for (const day of days) {
      const schedule = this.scheduleRepo.create({
        start_day: day,
        end_day: day,
        start_time: dto.start_time,
        end_time: dto.end_time,
        break_time: dto.break_time,
        barber_id: dto.barber_id,
      });

      const savedSchedule = await this.scheduleRepo.save(schedule);
      
      schedules.push({
        day: day,
        schedule: savedSchedule,
        slots: slots,
      });
    }

    return successRes(
      {
        schedules,
        totalDays: days.length,
      },
      201,
    );
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
      if (schedule.barber_id !== req['user'].id) {
        throw new ForbiddenException(
          "Siz boshqa barber ish rejasini o'zgartira olmaysiz",
        );
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
      if (!schedule) {
        throw new NotFoundException('Schedule not found');
      }
      if (schedule.barber_id !== req['user'].id) {
        throw new ForbiddenException(
          "Siz Boshqa barbenning ish rejasini o'zgartira olmaysiz",
        );
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

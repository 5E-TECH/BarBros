import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import {
  BarberScheduleEntity,
  DayOfWeek,
} from './entities/barber_schedule.entity';
import { CreateBarberScheduleDto } from './dto/create-barber_schedule.dto';
import { UpdateBarberScheduleDto } from './dto/update-barber_schedule.dto';
import { successRes } from 'src/utils/succesResponse';
import { Request } from 'express';

@Injectable()
export class BarberScheduleService {
  constructor(
    @InjectRepository(BarberScheduleEntity)
    private readonly scheduleRepo: Repository<BarberScheduleEntity>,
  ) {}

  private getDaysBetween(startDay: DayOfWeek, endDay: DayOfWeek): DayOfWeek[] {
    const daysOfWeek = [
      DayOfWeek.MONDAY,
      DayOfWeek.TUESDAY,
      DayOfWeek.WEDNESDAY,
      DayOfWeek.THURSDAY,
      DayOfWeek.FRIDAY,
      DayOfWeek.SATURDAY,
      DayOfWeek.SUNDAY,
    ];

    const startIndex = daysOfWeek.indexOf(startDay);
    const endIndex = daysOfWeek.indexOf(endDay);

    if (startIndex <= endIndex) {
      return daysOfWeek.slice(startIndex, endIndex + 1);
    } else {
      return [
        ...daysOfWeek.slice(startIndex),
        ...daysOfWeek.slice(0, endIndex + 1),
      ];
    }
  }

  private validateTimeRange(startTime: string, endTime: string): void {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);

    if (start >= end) {
      throw new BadRequestException(
        "start_time end_time dan oldin bo'lishi kerak",
      );
    }
  }

  async create(dto: CreateBarberScheduleDto, req: Request) {
    try {
      // 1. Vaqt validatsiyasi
      this.validateTimeRange(dto.start_time, dto.end_time);

      // 2. Kunlarni olish
      const days = this.getDaysBetween(dto.start_day, dto.end_day);

      // 3. Mavjud jadvallarni tekshirish
      const existingSchedules = await this.scheduleRepo.find({
        where: {
          barber_id: dto.barber_id,
          day_of_week: In(days),
        },
      });

      if (existingSchedules.length > 0) {
        const existingDays = existingSchedules
          .map((s) => s.day_of_week)
          .join(', ');
        throw new ConflictException(
          `Bu kunlar uchun jadval allaqachon mavjud: ${existingDays}`,
        );
      }

      // 4. Bulk insert - bir marta DB ga murojaat
      const schedules = days.map((day) =>
        this.scheduleRepo.create({
          day_of_week: day,
          start_time: dto.start_time,
          end_time: dto.end_time,
          break_time: dto.break_time,
          barber_id: dto.barber_id,
        }),
      );

      const savedSchedules = await this.scheduleRepo.save(schedules);

      return successRes(
        {
          schedules: savedSchedules,
          totalDays: savedSchedules.length,
          message: `${savedSchedules.length} kun uchun jadval muvaffaqiyatli yaratildi`,
        },
        201,
      );
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      // Database unique constraint error
      if (error.code === '23505' || error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Bu barber uchun jadval allaqachon mavjud');
      }

      throw new BadRequestException(
        `Jadval yaratishda xatolik: ${error.message}`,
      );
    }
  }

  async findAll() {
    try {
      const schedules = await this.scheduleRepo.find({
        relations: ['barber'],
        order: { day_of_week: 'ASC' },
      });

      return successRes(
        {
          schedules,
          total: schedules.length,
        },
        200,
      );
    } catch (error) {
      throw new BadRequestException(
        `Jadvallarni olishda xatolik: ${error.message}`,
      );
    }
  }

  async findOne(id: number) {
    try {
      const schedule = await this.scheduleRepo.findOne({
        where: { id },
        relations: ['barber'],
      });

      if (!schedule) {
        throw new BadRequestException('Jadval topilmadi');
      }

      return successRes({ schedule }, 200);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Jadval olishda xatolik: ${error.message}`);
    }
  }

  async getSchedulesByBarber(req: Request) {
    try {
      const barberId = req['user']?.id;

      if (!barberId) {
        throw new BadRequestException('Barber ID topilmadi');
      }

      const schedules = await this.scheduleRepo.find({
        where: { barber_id: barberId },
        relations: ['barber'],
        order: { day_of_week: 'ASC' },
      });

      return successRes(
        {
          schedules,
          total: schedules.length,
        },
        200,
      );
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        `Jadvallarni olishda xatolik: ${error.message}`,
      );
    }
  }

  async findByBarber(barberId: number) {
    try {
      const schedules = await this.scheduleRepo.find({
        where: { barber_id: barberId },
        relations: ['barber'],
        order: { day_of_week: 'ASC' },
      });

      return successRes(
        {
          schedules,
          total: schedules.length,
        },
        200,
      );
    } catch (error) {
      throw new BadRequestException(
        `Jadvallarni olishda xatolik: ${error.message}`,
      );
    }
  }

  async findByBarberAndDay(barberId: number, dayOfWeek: DayOfWeek) {
    try {
      const schedule = await this.scheduleRepo.findOne({
        where: { barber_id: barberId, day_of_week: dayOfWeek },
        relations: ['barber'],
      });

      if (!schedule) {
        throw new BadRequestException(
          `${dayOfWeek} kuni uchun jadval topilmadi`,
        );
      }

      return successRes({ schedule }, 200);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Jadval olishda xatolik: ${error.message}`);
    }
  }

  async update(id: number, dto: UpdateBarberScheduleDto, req: Request) {
    try {
      const schedule = await this.scheduleRepo.findOne({ where: { id } });

      if (!schedule) {
        throw new BadRequestException('Jadval topilmadi');
      }

      // Agar vaqt yangilanayotgan bo'lsa, validatsiya qilish
      const newStartTime = dto.start_time || schedule.start_time;
      const newEndTime = dto.end_time || schedule.end_time;
      this.validateTimeRange(newStartTime, newEndTime);

      Object.assign(schedule, dto);
      const updatedSchedule = await this.scheduleRepo.save(schedule);

      return successRes(
        {
          schedule: updatedSchedule,
          message: 'Jadval muvaffaqiyatli yangilandi',
        },
        200,
      );
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      if (error.code === '23505' || error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Bu kun uchun jadval allaqachon mavjud');
      }

      throw new BadRequestException(
        `Jadval yangilashda xatolik: ${error.message}`,
      );
    }
  }

  async remove(id: number, req: Request) {
    try {
      const schedule = await this.scheduleRepo.findOne({ where: { id } });

      if (!schedule) {
        throw new BadRequestException('Jadval topilmadi');
      }

      await this.scheduleRepo.remove(schedule);

      return successRes(
        {
          message: "Jadval muvaffaqiyatli o'chirildi",
        },
        200,
      );
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        `Jadval o'chirishda xatolik: ${error.message}`,
      );
    }
  }

  async removeByBarber(barberId: number) {
    try {
      const schedules = await this.scheduleRepo.find({
        where: { barber_id: barberId },
      });

      if (schedules.length === 0) {
        throw new BadRequestException('Bu barber uchun jadvallar topilmadi');
      }

      await this.scheduleRepo.remove(schedules);

      return successRes(
        {
          deletedCount: schedules.length,
          message: `${schedules.length} ta jadval o'chirildi`,
        },
        200,
      );
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        `Jadvallarni o'chirishda xatolik: ${error.message}`,
      );
    }
  }
}

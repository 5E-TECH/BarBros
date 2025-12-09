import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingEntity } from '../../core/entity/booking.entity';
import { Repository } from 'typeorm';
import { ErrorHender } from 'src/infrostructure/utils/catchError';
import { successRes } from 'src/infrostructure/utils/succesResponse';

import { Request } from 'express';
import { BarberScheduleEntity } from 'src/core/entity/barber_schedule.entity';
import { ServiceEntity } from 'src/core/entity/service.entity';
import { BarberEntity } from 'src/core/entity/barber.entity';
import { UpdateBookingDto } from './dto/update-booking.dto';
const dayjs = require('dayjs');
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore.js');

dayjs.extend(isSameOrBefore);

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(BookingEntity)
    private readonly Booking: Repository<BookingEntity>,
    @InjectRepository(BarberScheduleEntity)
    private readonly barberscherepo: Repository<BarberScheduleEntity>,
    @InjectRepository(ServiceEntity)
    private readonly servicerepo: Repository<ServiceEntity>,
    @InjectRepository(BarberEntity)
    private readonly Barber: Repository<BarberEntity>,
  ) {}

  async create(createBookingDto: CreateBookingDto, req: Request) {
    try {
      let barber = await this.Barber.findOne({
        where: { id: createBookingDto.barber_id },
      });
      if (!barber) {
        throw new NotFoundException('Not fount barber')
      }
      const data = this.Booking.create({
        ...createBookingDto,
        user_id: req['user'].id,
      });
      await this.Booking.save(data)
      return successRes(data, 201)
    } catch (error) {
      return ErrorHender(error)
    }
  }
  async delet(updateBookingDto: UpdateBookingDto, id: string) {
    try {
      const booking = await this.Booking.findOne({
        where: {
          barber_id: updateBookingDto.barber_id,
          date: updateBookingDto.date,
          id: id,
        },
      });
      if (!booking) {
        throw new NotFoundException('Not fount data');
      }
      const delet = await this.Booking.remove(booking);
      return successRes(delet);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async findAllBarber(req: Request) {
    try {
      const data = await this.Booking.find({
        where: { barber_id: req['user'].id },relations:["service", "user","barber"]
      });
      if (!data.length) {
        throw new NotFoundException('Not fount data');
      }
      return successRes(data);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async findAllUser(req: Request) {
    try {
      const data = await this.Booking.find({
        where: { user_id: req['user'].id, },relations:["service", "user","barber"]
      });
      if (!data.length) {
        throw new NotFoundException('Not fount data');
      }
      return successRes(data);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async findAll_Abdin(){
    try {
      const data = await this.Booking.find({relations:["service", "user","barber"]})
      if(!data.length){
        throw new NotFoundException("Not fount data")
      }
      return successRes(data)
    } catch (error) {
      return ErrorHender(error)
    }
  }

  /////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////
  
  async getBarberAvailability(
    barberId: string,
    date: string,
    serviceId: string,
  ) {
    const weekday = dayjs(date).format('dddd');

    const schedule = await this.barberscherepo.findOne({
      where: { barber_id: barberId, working_day: weekday },
    });

    if (!schedule) {
      return {
        message: 'Barber does not work on this day',
        date: dayjs(date).format('YYYY-MM-DD'),
        freeSlots: [],
        bookedSlots: [],
        bookedRanges: [],
      };
    }

    const selectedService = await this.servicerepo.findOne({
      where: { id: serviceId },
    });
    if (!selectedService) {
      throw new NotFoundException('Service not found')
    }

    const userServiceDuration = selectedService.duration_minutes

    const start = dayjs(`${date}T${schedule.start_time}`)
    const end = dayjs(`${date}T${schedule.end_time}`)

    const allSlots: string[] = [];
    let current = start;
    while (current.add(userServiceDuration, 'minute').isSameOrBefore(end)) {
      allSlots.push(current.format('HH:mm'));
      current = current.add(15, 'minute');
    }

    const bookings = await this.Booking.find({
      where: {
        barber_id: barberId,
        date: dayjs(date).toDate(),
      },
    });

    const bookedSlots: string[] = []
    const bookedRanges: { start: string; end: string }[] = []

    for (const booking of bookings) {
      const bookedService = await this.servicerepo.findOne({
        where: { id: booking.service_id },
      })
      const bookDuration = bookedService?.duration_minutes || 30

      const startTime = dayjs(
        `${booking.date}T${booking.time}`,
        'YYYY-MM-DDTHH:mm:ss',
      );
      const endTime = startTime.add(bookDuration, 'minute');

      bookedRanges.push({
        start: startTime.format('HH:mm'),
        end: endTime.format('HH:mm'),
      });

      let slotPointer = startTime;
      while (slotPointer.isBefore(endTime)) {
        bookedSlots.push(slotPointer.format('HH:mm'))
        slotPointer = slotPointer.add(15, 'minute')
      }
    }

    const freeSlots = allSlots.filter((slot) => !bookedSlots.includes(slot))

    return {
      date: dayjs(date).format('YYYY-MM-DD'),
      freeSlots,
      bookedSlots: [...new Set(bookedSlots)],
      bookedRanges,
    }
  }
}

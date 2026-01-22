import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingEntity } from './entities/booking.entity';
import { Repository } from 'typeorm';
import { ErrorHender } from 'src/utils/catchError';
import { successRes } from 'src/utils/succesResponse';

import { Request } from 'express';
import { BarberScheduleEntity } from '../barber_schedule/entities/barber_schedule.entity';
import { ServiceEntity } from 'src/modules/service/entities/service.entity';
import { BarberEntity } from 'src/modules/barber/entities/barber.entity';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BarberShopServicesEntity } from '../barber-shop-services/entities/barber-shop-services.entity';
import { TransactionEntity } from '../transactions/entities/transaction.entity';
import { NotificationEntity } from '../notification/entities/notification.entity';
import { UserEntity } from 'src/modules/user/entities/user.admin,entity';
import {
  BookingStatus,
  OrderType,
  PaymentModel,
  PaymentStatus,
  UserRole,
} from 'src/common/enum';
import { DayOfWeek } from '../barber_schedule/entities/barber_schedule.entity';
import { CreateOfflineBookingDto } from './dto/create-offline-booking.dto';
import { SubscriptionService } from '../subscription/subscription.service';
const dayjs = require('dayjs');
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore.js');
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter.js');

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

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
    @InjectRepository(BarberShopServicesEntity)
    private readonly barberShopServicesRepo: Repository<BarberShopServicesEntity>,
    @InjectRepository(TransactionEntity)
    private readonly transactionRepo: Repository<TransactionEntity>,
    @InjectRepository(NotificationEntity)
    private readonly notificationRepo: Repository<NotificationEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly subscriptionService: SubscriptionService,
  ) { }

  async create(createBookingDto: CreateBookingDto, req: Request) {
    try {
      const user = req['user'];
      if (user.role !== UserRole.USER) {
        throw new ForbiddenException('Only users can create bookings');
      }
      if (createBookingDto.order_type !== OrderType.ONLINE) {
        throw new BadRequestException('Users can only create online bookings');
      }

      const date = dayjs(createBookingDto.date).format('YYYY-MM-DD');
      const time = createBookingDto.time;

      const barber = await this.Barber.findOne({
        where: { id: createBookingDto.barber_id },
        relations: ['barberShop'],
      });
      if (!barber) {
        throw new NotFoundException('Not fount barber');
      }

      const service = await this.servicerepo.findOne({
        where: { id: createBookingDto.service_id },
      });
      if (!service) {
        throw new NotFoundException('Service not found');
      }

      if (
        !barber.barberShop ||
        Number(barber.barberShop.id) !== Number(createBookingDto.barber_shop_id)
      ) {
        throw new BadRequestException('Barber does not belong to this shop');
      }

      const shopService = await this.barberShopServicesRepo.findOne({
        where: {
          barber_shop_id: createBookingDto.barber_shop_id,
          service_id: createBookingDto.service_id,
        },
      });
      if (!shopService) {
        throw new BadRequestException('Service not offered by this shop');
      }
      await this.subscriptionService.ensureActive(createBookingDto.barber_shop_id);
      const durationMinutes =
        shopService.duration_minutes ?? service.duration_minutes;

      await this.assertBarberAvailable(
        createBookingDto.barber_id,
        date,
        time,
        durationMinutes,
      );

      const data = this.Booking.create({
        user_id: user.id,
        service_id: createBookingDto.service_id,
        barber_shop_id: createBookingDto.barber_shop_id,
        barber_id: createBookingDto.barber_id,
        date,
        time,
        payment_model: createBookingDto.payment_model as PaymentModel,
        order_type: OrderType.ONLINE,
        payment_status: PaymentStatus.PENDING,
        status: BookingStatus.PENDING,
      });

      await this.Booking.save(data);
      await this.notificationRepo.save(
        this.notificationRepo.create({
          message: `New booking from user ${user.id} for ${date} ${time}`,
          barber_id: createBookingDto.barber_id,
          is_read: false,
        }),
      );
      return successRes(data, 201);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async createOffline(dto: CreateOfflineBookingDto, req: Request) {
    try {
      const user = req['user'];
      if (![UserRole.BARBER, UserRole.SP_ADMIN].includes(user.role)) {
        throw new ForbiddenException('Only barber or barber shop can create offline bookings');
      }

      if (user.role === UserRole.BARBER && dto.barber_id !== user.id) {
        throw new ForbiddenException('Barber can only book for self');
      }

      if (user.role === UserRole.SP_ADMIN && dto.barber_shop_id !== user.id) {
        throw new ForbiddenException('Cannot use another barber shop id');
      }

      const client = await this.userRepo.findOne({
        where: { id: dto.user_id },
      });
      if (!client) {
        throw new NotFoundException('User not found');
      }

      const date = dayjs(dto.date).format('YYYY-MM-DD');
      const time = dto.time;

      const barber = await this.Barber.findOne({
        where: { id: dto.barber_id },
        relations: ['barberShop'],
      });
      if (!barber) {
        throw new NotFoundException('Not fount barber');
      }

      const service = await this.servicerepo.findOne({
        where: { id: dto.service_id },
      });
      if (!service) {
        throw new NotFoundException('Service not found');
      }

      if (
        !barber.barberShop ||
        Number(barber.barberShop.id) !== Number(dto.barber_shop_id)
      ) {
        throw new BadRequestException('Barber does not belong to this shop');
      }

      const shopService = await this.barberShopServicesRepo.findOne({
        where: {
          barber_shop_id: dto.barber_shop_id,
          service_id: dto.service_id,
        },
      });
      if (!shopService) {
        throw new BadRequestException('Service not offered by this shop');
      }

      await this.subscriptionService.ensureActive(dto.barber_shop_id);

      const durationMinutes =
        shopService.duration_minutes ?? service.duration_minutes;

      await this.assertBarberAvailable(
        dto.barber_id,
        date,
        time,
        durationMinutes,
      );

      const data = this.Booking.create({
        user_id: dto.user_id,
        service_id: dto.service_id,
        barber_shop_id: dto.barber_shop_id,
        barber_id: dto.barber_id,
        date,
        time,
        payment_model: dto.payment_model as PaymentModel,
        order_type: OrderType.OFFLINE,
        payment_status: PaymentStatus.PENDING,
        status: BookingStatus.CONFIRMED,
      });

      await this.Booking.save(data);
      await this.notificationRepo.save(
        this.notificationRepo.create({
          message: `Booking created for ${date} ${time}`,
          user_id: dto.user_id,
          is_read: false,
        }),
      );

      return successRes(data, 201);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async cancel(id: number, req: Request) {
    try {
      const booking = await this.Booking.findOne({ where: { id } });
      if (!booking) {
        throw new NotFoundException('Not fount data');
      }

      const user = req['user'];
      const allowed =
        user.role === UserRole.SUPPER_ADMIN ||
        user.role === UserRole.ADMIN ||
        (user.role === UserRole.USER && booking.user_id === user.id) ||
        (user.role === UserRole.BARBER && booking.barber_id === user.id);

      if (!allowed) {
        throw new ForbiddenException('Access denied');
      }

      booking.status = BookingStatus.CANCELLED;
      booking.reminder_sent = true;
      await this.Booking.save(booking);
      await this.notificationRepo.save(
        this.notificationRepo.create({
          message: `Booking cancelled for ${booking.date} ${booking.time}`,
          user_id: booking.user_id,
          is_read: false,
        }),
      );
      await this.notificationRepo.save(
        this.notificationRepo.create({
          message: `Booking cancelled for ${booking.date} ${booking.time}`,
          barber_id: booking.barber_id,
          is_read: false,
        }),
      );
      return successRes(booking);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async updateStatus(id: number, dto: UpdateBookingDto, req: Request) {
    try {
      const booking = await this.Booking.findOne({ where: { id } });
      if (!booking) {
        throw new NotFoundException('Not fount data');
      }

      if (!dto.status) {
        throw new BadRequestException('status is required');
      }

      const user = req['user'];
      const allowed =
        user.role === UserRole.SUPPER_ADMIN ||
        user.role === UserRole.ADMIN ||
        (user.role === UserRole.BARBER && booking.barber_id === user.id) ||
        (user.role === UserRole.SP_ADMIN &&
          booking.barber_shop_id === user.id);

      if (!allowed) {
        throw new ForbiddenException('Access denied');
      }

      const allowedTransitions: Record<BookingStatus, BookingStatus[]> = {
        [BookingStatus.PENDING]: [
          BookingStatus.CONFIRMED,
          BookingStatus.CANCELLED,
        ],
        [BookingStatus.CONFIRMED]: [
          BookingStatus.COMPLETED,
          BookingStatus.CANCELLED,
        ],
        [BookingStatus.COMPLETED]: [],
        [BookingStatus.CANCELLED]: [],
      };

      const current = booking.status;
      if (!allowedTransitions[current]?.includes(dto.status)) {
        throw new BadRequestException(
          `Invalid status transition: ${current} -> ${dto.status}`,
        );
      }

      booking.status = dto.status;
      if (dto.status === BookingStatus.COMPLETED) {
        booking.payment_status = PaymentStatus.PAID;
        booking.reminder_sent = true;
        await this.ensureTransaction(booking);
      }
      const updated = await this.Booking.save(booking);
      await this.notificationRepo.save(
        this.notificationRepo.create({
          message: `Your booking status is ${dto.status}`,
          user_id: booking.user_id,
          is_read: false,
        }),
      );
      return successRes(updated);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async findAllBarber(req: Request) {
    try {
      const user = req['user'];

      let whereCondition: any;

      // 👇 BARBER → only own bookings
      if (user.role === UserRole.BARBER) {
        whereCondition = {
          barber: { id: user.barberId },
        };
      }

      // 👇 SP_ADMIN → all bookings of barbershop
      else if (user.role === UserRole.SP_ADMIN) {
        whereCondition = {
          barberShop: { id: user.barberShopId },
        };
      }

      const data = await this.Booking.find({
        where: whereCondition,
        relations: ['service', 'user', 'barber', 'barberShop'],
        order: { created_at: 'DESC' },
      });

      return successRes(data);
    } catch (error) {
      return ErrorHender(error);
    }
  }


  async findAllUser(req: Request) {
    try {
      const data = await this.Booking.find({
        where: { user_id: req['user'].id },
        relations: ['service', 'user', 'barber', 'barberShop'],
      });
      if (!data.length) {
        throw new NotFoundException('Not fount data');
      }
      return successRes(data);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async findAll_Abdin(query: Record<string, any> = {}) {
    try {
      const { search, status, page = 1, limit = 10 } = query;
      const skip = (Number(page) - 1) * Number(limit);
      const qb = this.Booking.createQueryBuilder('booking')
        .leftJoinAndSelect('booking.service', 'service')
        .leftJoinAndSelect('booking.user', 'user')
        .leftJoinAndSelect('booking.barber', 'barber')
        .leftJoinAndSelect('booking.barberShop', 'barberShop')
        .leftJoinAndMapOne(
          'booking.shopService',
          BarberShopServicesEntity,
          'shopService',
          'shopService.barber_shop_id = booking.barber_shop_id AND shopService.service_id = booking.service_id',
        );

      if (search) {
        const term = `%${search}%`;
        qb.andWhere(
          '(' +
          'service.name ILIKE :term OR ' +
          'barber.full_name ILIKE :term OR ' +
          'barberShop.name ILIKE :term OR ' +
          'user.phone_number ILIKE :term OR ' +
          'user.full_name ILIKE :term OR ' +
          'booking.date ILIKE :term OR ' +
          'booking.time ILIKE :term OR ' +
          'CAST(booking.id AS text) ILIKE :term OR ' +
          'CAST(booking.status AS text) ILIKE :term OR ' +
          'CAST(booking.order_type AS text) ILIKE :term OR ' +
          'CAST(booking.payment_model AS text) ILIKE :term' +
          ')',
          { term },
        );
      }
      if (status) {
        qb.andWhere('booking.status = :status', { status });
      }

      const [data, total] = await qb
        .skip(skip)
        .take(Number(limit))
        .getManyAndCount();

      if (!data.length) {
        throw new NotFoundException("Not fount data")
      }

      return successRes({
        data,
        total,
        currentPage: Number(page),
        pageSize: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      })
    } catch (error) {
      return ErrorHender(error)
    }
  }

  async findOneAdmin(id: number) {
    try {
      const data = await this.Booking.createQueryBuilder('booking')
        .leftJoinAndSelect('booking.service', 'service')
        .leftJoinAndSelect('booking.user', 'user')
        .leftJoinAndSelect('booking.barber', 'barber')
        .leftJoinAndSelect('booking.barberShop', 'barberShop')
        .leftJoinAndMapOne(
          'booking.shopService',
          BarberShopServicesEntity,
          'shopService',
          'shopService.barber_shop_id = booking.barber_shop_id AND shopService.service_id = booking.service_id',
        )
        .where('booking.id = :id', { id })
        .getOne();

      if (!data) {
        throw new NotFoundException('Not fount data');
      }

      return successRes(data);
    } catch (error) {
      return ErrorHender(error);
    }
  }


  async getBarberAvailability(
    barberId: number,
    date: string,
    serviceId: number,
  ) {
    try {
      const barber = await this.Barber.findOne({
        where: { id: barberId },
        relations: ['barberShop'],
      });
      if (!barber) {
        throw new NotFoundException('Barber not found');
      }
      const selectedService = await this.servicerepo.findOne({
        where: { id: serviceId },
      });
      if (!selectedService) {
        throw new NotFoundException('Service not found');
      }
      const shopService = barber.barberShop
        ? await this.barberShopServicesRepo.findOne({
          where: {
            barber_shop_id: barber.barberShop.id,
            service_id: serviceId,
          },
        })
        : null;
      const durationMinutes =
        shopService?.duration_minutes ?? selectedService.duration_minutes;

      const normalizedDate = dayjs(date).format('YYYY-MM-DD');
      return this.buildAvailabilityForDate(
        barberId,
        normalizedDate,
        durationMinutes,
      );
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async getBarberAvailabilityRange(
    barberId: number,
    from: string,
    to: string,
    serviceId: number,
  ) {
    const barber = await this.Barber.findOne({
      where: { id: barberId },
      relations: ['barberShop'],
    });
    if (!barber) {
      throw new NotFoundException('Barber not found');
    }
    const selectedService = await this.servicerepo.findOne({
      where: { id: serviceId },
    });
    if (!selectedService) {
      throw new NotFoundException('Service not found');
    }
    const shopService = barber.barberShop
      ? await this.barberShopServicesRepo.findOne({
        where: {
          barber_shop_id: barber.barberShop.id,
          service_id: serviceId,
        },
      })
      : null;
    const durationMinutes =
      shopService?.duration_minutes ?? selectedService.duration_minutes;

    const start = dayjs(from).startOf('day');
    const end = dayjs(to).startOf('day');

    if (!start.isValid() || !end.isValid()) {
      throw new BadRequestException('Invalid date range');
    }
    if (end.isBefore(start)) {
      throw new BadRequestException('to date must be after from date');
    }

    const result: { date: string; freeSlots: string[] }[] = [];
    let cursor = start;
    while (cursor.isSameOrBefore(end)) {
      const date = cursor.format('YYYY-MM-DD');
      const availability = await this.buildAvailabilityForDate(
        barberId,
        date,
        durationMinutes,
      );
      result.push({
        date: availability.date,
        freeSlots: availability.freeSlots,
      });
      cursor = cursor.add(1, 'day');
    }

    return successRes({
      from: start.format('YYYY-MM-DD'),
      to: end.format('YYYY-MM-DD'),
      totalDays: result.length,
      days: result,
    });
  }

  async findAvailableBarbers(
    barberShopId: number,
    serviceId: number,
    date: string,
    time: string,
  ) {
    try {
      const selectedService = await this.servicerepo.findOne({
        where: { id: serviceId },
      });
      if (!selectedService) {
        throw new NotFoundException('Service not found');
      }

      const barbers = await this.Barber.createQueryBuilder('barber')
        .leftJoinAndSelect('barber.service', 'service')
        .leftJoinAndSelect('barber.barberShop', 'barberShop')
        .leftJoinAndSelect('barber.barberImage', 'barberImage')
        .leftJoinAndSelect('barber.reyting', 'reyting')
        .where('barberShop.id = :barberShopId', { barberShopId })
        .andWhere('service.id = :serviceId', { serviceId })
        .getMany();

      const normalizedDate = dayjs(date).format('YYYY-MM-DD');

      const available: BarberEntity[] = [];
      for (const barber of barbers) {
        const ok = await this.isBarberAvailable(
          barber.id,
          normalizedDate,
          time,
          selectedService.duration_minutes,
        );
        if (ok) {
          available.push(barber);
        }
      }

      return successRes(available);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  private async buildAvailabilityForDate(
    barberId: number,
    date: string,
    durationMinutes: number,
  ) {
    const weekday = dayjs(date).format('dddd').toLowerCase() as DayOfWeek;

    const schedule = await this.barberscherepo.findOne({
      where: { barber_id: barberId, day_of_week: weekday },
    });

    if (!schedule) {
      return {
        date,
        freeSlots: [],
        bookedSlots: [],
        bookedRanges: [],
      };
    }

    const start = dayjs(`${date}T${schedule.start_time}`);
    const end = dayjs(`${date}T${schedule.end_time}`);

    const allSlots: string[] = [];
    let current = start;
    while (current.add(durationMinutes, 'minute').isSameOrBefore(end)) {
      allSlots.push(current.format('HH:mm'));
      current = current.add(15, 'minute');
    }

    const bookings = await this.Booking.find({
      where: {
        barber_id: barberId,
        date: date,
      },
      relations: ['service'],
    });

    const bookedSlots: string[] = [];
    const bookedRanges: { start: string; end: string }[] = [];

    for (const booking of bookings) {
      if (booking.status === BookingStatus.CANCELLED) continue;
      const bookDuration = booking.service?.duration_minutes || 30;

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
        bookedSlots.push(slotPointer.format('HH:mm'));
        slotPointer = slotPointer.add(15, 'minute');
      }
    }

    const freeSlots = allSlots.filter((slot) => !bookedSlots.includes(slot));

    return {
      date,
      freeSlots,
      bookedSlots: [...new Set(bookedSlots)],
      bookedRanges,
    };
  }

  private async assertBarberAvailable(
    barberId: number,
    date: string,
    time: string,
    durationMinutes: number,
  ) {
    const weekday = dayjs(date).format('dddd').toLowerCase() as DayOfWeek;
    const schedule = await this.barberscherepo.findOne({
      where: { barber_id: barberId, day_of_week: weekday },
    });

    if (!schedule) {
      throw new BadRequestException('Barber does not work on this day');
    }

    const start = dayjs(`${date}T${schedule.start_time}`);
    const end = dayjs(`${date}T${schedule.end_time}`);
    const bookingStart = dayjs(`${date}T${time}`);
    const bookingEnd = bookingStart.add(durationMinutes, 'minute');

    if (!bookingStart.isSameOrAfter(start) || !bookingEnd.isSameOrBefore(end)) {
      throw new BadRequestException('Selected time is outside of schedule');
    }

    const existing = await this.Booking.find({
      where: { barber_id: barberId, date },
      relations: ['service'],
    });

    for (const item of existing) {
      if (item.status === BookingStatus.CANCELLED) continue;
      const itemDuration = item.service?.duration_minutes || 30;
      const itemStart = dayjs(`${item.date}T${item.time}`);
      const itemEnd = itemStart.add(itemDuration, 'minute');

      const overlap =
        bookingStart.isBefore(itemEnd) && bookingEnd.isAfter(itemStart);
      if (overlap) {
        throw new BadRequestException('Selected time is already booked');
      }
    }
  }

  private async isBarberAvailable(
    barberId: number,
    date: string,
    time: string,
    durationMinutes: number,
  ) {
    const weekday = dayjs(date).format('dddd').toLowerCase() as DayOfWeek;
    const schedule = await this.barberscherepo.findOne({
      where: { barber_id: barberId, day_of_week: weekday },
    });

    if (!schedule) {
      return false;
    }

    const start = dayjs(`${date}T${schedule.start_time}`);
    const end = dayjs(`${date}T${schedule.end_time}`);
    const bookingStart = dayjs(`${date}T${time}`);
    const bookingEnd = bookingStart.add(durationMinutes, 'minute');

    if (!bookingStart.isSameOrAfter(start) || !bookingEnd.isSameOrBefore(end)) {
      return false;
    }

    const existing = await this.Booking.find({
      where: { barber_id: barberId, date },
      relations: ['service'],
    });

    for (const item of existing) {
      if (item.status === BookingStatus.CANCELLED) continue;
      const itemDuration = item.service?.duration_minutes || 30;
      const itemStart = dayjs(`${item.date}T${item.time}`);
      const itemEnd = itemStart.add(itemDuration, 'minute');

      const overlap =
        bookingStart.isBefore(itemEnd) && bookingEnd.isAfter(itemStart);
      if (overlap) {
        return false;
      }
    }

    return true;
  }

  private async ensureTransaction(booking: BookingEntity) {
    const exists = await this.transactionRepo.findOne({
      where: { booking_id: booking.id },
    });
    if (exists) return;

    const shopService = await this.barberShopServicesRepo.findOne({
      where: {
        barber_shop_id: booking.barber_shop_id,
        service_id: booking.service_id,
      },
    });
    if (!shopService) {
      throw new BadRequestException('Service price not found for this shop');
    }

    const transaction = this.transactionRepo.create({
      booking_id: booking.id,
      barber_id: booking.barber_id,
      barber_shop_id: booking.barber_shop_id,
      service_id: booking.service_id,
      amount: shopService.price,
      payment_model: booking.payment_model,
      payment_status: booking.payment_status,
    });

    await this.transactionRepo.save(transaction);
  }
}

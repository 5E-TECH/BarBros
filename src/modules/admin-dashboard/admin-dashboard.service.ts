import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/modules/user/entities/user.admin,entity';
import { BarberShopEntity } from 'src/modules/barber-shop/entities/barber-shop.entity';
import { BarberEntity } from 'src/modules/barber/entities/barber.entity';
import { BookingEntity } from 'src/modules/booking/entities/booking.entity';
import { TransactionEntity } from 'src/modules/transactions/entities/transaction.entity';
import { ServiceEntity } from 'src/modules/service/entities/service.entity';
import { SubscriptionEntity } from 'src/modules/subscription/entities/subscription.entity';
import { BookingStatus, SubscriptionStatus, UserRole } from 'src/common/enum';
import { successRes } from 'src/utils/succesResponse';
import { ErrorHender } from 'src/utils/catchError';

@Injectable()
export class AdminDashboardService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(BarberShopEntity)
    private readonly shopRepo: Repository<BarberShopEntity>,
    @InjectRepository(BarberEntity)
    private readonly barberRepo: Repository<BarberEntity>,
    @InjectRepository(BookingEntity)
    private readonly bookingRepo: Repository<BookingEntity>,
    @InjectRepository(TransactionEntity)
    private readonly transactionRepo: Repository<TransactionEntity>,
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepo: Repository<SubscriptionEntity>,
    @InjectRepository(ServiceEntity)
    private readonly serviceRepo: Repository<ServiceEntity>,
  ) {}

  async summary(query: Record<string, any>) {
    try {
      const { period = 'monthly' } = query;
      const { start, end } = this.resolveDateRange(query);

      const [total_users, total_barbershops, total_barbers] =
        await Promise.all([
          this.userRepo.count({ where: { role: UserRole.USER } }),
          this.shopRepo.count(),
          this.barberRepo.count(),
        ]);

      const bookingStats = await this.bookingRepo
        .createQueryBuilder('b')
        .select('b.status', 'status')
        .addSelect('COUNT(*)', 'count')
        .groupBy('b.status')
        .getRawMany();

      const total_revenue = await this.sumTransactions(start, end);
      const revenue_series = await this.revenueSeries(period, start, end);
      const subscription_series = await this.subscriptionSeries(period, start, end);
      const subscription_stats = await this.subscriptionStats();
      const top_barbershops = await this.topBarberShops(start, end);
      const top_services = await this.topServices(start, end);

      return successRes({
        totals: {
          users: total_users,
          barbershops: total_barbershops,
          barbers: total_barbers,
        },
        bookings: {
          total: bookingStats.reduce((sum, row) => sum + Number(row.count), 0),
          by_status: this.normalizeBookingStats(bookingStats),
        },
        revenue: {
          total_amount: total_revenue,
          series: revenue_series,
        },
        subscriptions: {
          stats: subscription_stats,
          series: subscription_series,
        },
        top_barbershops,
        top_services,
        range: {
          start: start ? Math.floor(start.getTime()) : null,
          end: end ? Math.floor(end.getTime()) : null,
          period,
        },
      });
    } catch (error) {
      return ErrorHender(error);
    }
  }

  private normalizeBookingStats(raw: { status: string; count: string }[]) {
    const base = {
      [BookingStatus.PENDING]: 0,
      [BookingStatus.CONFIRMED]: 0,
      [BookingStatus.COMPLETED]: 0,
      [BookingStatus.CANCELLED]: 0,
    };
    raw.forEach((row) => {
      const key = row.status as BookingStatus;
      if (key in base) {
        base[key] = Number(row.count);
      }
    });
    return base;
  }

  private async sumTransactions(start?: Date, end?: Date) {
    const qb = this.transactionRepo
      .createQueryBuilder('t')
      .select('COALESCE(SUM(t.amount), 0)', 'total');

    if (start) {
      qb.andWhere('t.created_at >= :start', {
        start: Math.floor(start.getTime()),
      });
    }
    if (end) {
      qb.andWhere('t.created_at <= :end', {
        end: Math.floor(end.getTime()),
      });
    }

    const result = await qb.getRawOne();
    return Number(result?.total ?? 0);
  }

  private async revenueSeries(period: string, start?: Date, end?: Date) {
    const bucket =
      period === 'weekly' ? 'week' : period === 'monthly' ? 'month' : 'day';
    const labelFormat =
      period === 'weekly'
        ? 'IYYY-IW'
        : period === 'monthly'
          ? 'YYYY-MM'
          : 'YYYY-MM-DD';

    const qb = this.transactionRepo
      .createQueryBuilder('t')
      .select(
        `to_char(date_trunc('${bucket}', to_timestamp(t.created_at/1000)), '${labelFormat}')`,
        'label',
      )
      .addSelect('COALESCE(SUM(t.amount), 0)', 'total_amount')
      .groupBy('label')
      .orderBy('label', 'ASC');

    if (start) {
      qb.andWhere('t.created_at >= :start', {
        start: Math.floor(start.getTime()),
      });
    }
    if (end) {
      qb.andWhere('t.created_at <= :end', {
        end: Math.floor(end.getTime()),
      });
    }

    return qb.getRawMany();
  }

  private async subscriptionSeries(period: string, start?: Date, end?: Date) {
    const bucket =
      period === 'weekly' ? 'week' : period === 'monthly' ? 'month' : 'day';
    const labelFormat =
      period === 'weekly'
        ? 'IYYY-IW'
        : period === 'monthly'
          ? 'YYYY-MM'
          : 'YYYY-MM-DD';

    const qb = this.subscriptionRepo
      .createQueryBuilder('s')
      .select(
        `to_char(date_trunc('${bucket}', to_timestamp(s.created_at/1000)), '${labelFormat}')`,
        'label',
      )
      .addSelect('COUNT(*)', 'total_subscriptions')
      .groupBy('label')
      .orderBy('label', 'ASC');

    if (start) {
      qb.andWhere('s.created_at >= :start', {
        start: Math.floor(start.getTime()),
      });
    }
    if (end) {
      qb.andWhere('s.created_at <= :end', {
        end: Math.floor(end.getTime()),
      });
    }

    return qb.getRawMany();
  }

  private async subscriptionStats() {
    const rows = await this.subscriptionRepo
      .createQueryBuilder('s')
      .select('s.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('s.status')
      .getRawMany();

    const base = {
      [SubscriptionStatus.ACTIVE]: 0,
      [SubscriptionStatus.EXPIRED]: 0,
      [SubscriptionStatus.CANCELLED]: 0,
    };

    rows.forEach((row) => {
      const key = row.status as SubscriptionStatus;
      if (key in base) {
        base[key] = Number(row.count);
      }
    });

    return base;
  }

  private async topBarberShops(start?: Date, end?: Date) {
    const qb = this.transactionRepo
      .createQueryBuilder('t')
      .leftJoin(BarberShopEntity, 's', 's.id = t.barber_shop_id')
      .select('t.barber_shop_id', 'barber_shop_id')
      .addSelect('s.name', 'barber_shop_name')
      .addSelect('COALESCE(SUM(t.amount), 0)', 'total_amount')
      .groupBy('t.barber_shop_id')
      .addGroupBy('s.name')
      .orderBy('total_amount', 'DESC')
      .limit(10);

    if (start) {
      qb.andWhere('t.created_at >= :start', {
        start: Math.floor(start.getTime()),
      });
    }
    if (end) {
      qb.andWhere('t.created_at <= :end', {
        end: Math.floor(end.getTime()),
      });
    }

    return qb.getRawMany();
  }

  private async topServices(start?: Date, end?: Date) {
    const qb = this.transactionRepo
      .createQueryBuilder('t')
      .leftJoin(ServiceEntity, 's', 's.id = t.service_id')
      .select('t.service_id', 'service_id')
      .addSelect('s.name', 'service_name')
      .addSelect('COUNT(*)', 'total_orders')
      .addSelect('COALESCE(SUM(t.amount), 0)', 'total_amount')
      .groupBy('t.service_id')
      .addGroupBy('s.name')
      .orderBy('total_orders', 'DESC')
      .limit(10);

    if (start) {
      qb.andWhere('t.created_at >= :start', {
        start: Math.floor(start.getTime()),
      });
    }
    if (end) {
      qb.andWhere('t.created_at <= :end', {
        end: Math.floor(end.getTime()),
      });
    }

    return qb.getRawMany();
  }

  private resolveDateRange(query: Record<string, any>) {
    const { range, startDate, endDate } = query;

    let start: Date | undefined;
    let end: Date | undefined;

    if (startDate || endDate) {
      const parsedStart = startDate ? new Date(startDate) : undefined;
      const parsedEnd = endDate ? new Date(endDate) : undefined;

      if (parsedStart && isNaN(parsedStart.getTime())) {
        throw new BadRequestException('Invalid startDate');
      }
      if (parsedEnd && isNaN(parsedEnd.getTime())) {
        throw new BadRequestException('Invalid endDate');
      }

      if (parsedStart) {
        start = new Date(parsedStart);
        start.setHours(0, 0, 0, 0);
      }
      if (parsedEnd) {
        end = new Date(parsedEnd);
        end.setHours(23, 59, 59, 999);
      }
    } else {
      const now = new Date();
      if (range === 'daily') {
        start = new Date(now);
        start.setHours(0, 0, 0, 0);
      } else if (range === 'weekly') {
        start = new Date(now);
        const day = start.getDay();
        const diff = day === 0 ? 6 : day - 1;
        start.setDate(start.getDate() - diff);
        start.setHours(0, 0, 0, 0);
      } else if (range === 'monthly') {
        start = new Date(now.getFullYear(), now.getMonth(), 1);
      }
    }

    return { start, end };
  }
}

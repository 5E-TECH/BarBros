import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { TransactionEntity } from './entities/transaction.entity';
import { Request } from 'express';
import { successRes } from 'src/utils/succesResponse';
import { ErrorHender } from 'src/utils/catchError';
import { UserRole } from 'src/common/enum';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepo: Repository<TransactionEntity>,
  ) {}

  async findAll() {
    try {
      const data = await this.transactionRepo.find({
        order: { created_at: 'DESC' },
      });
      return successRes(data);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async findMyShop(req: Request) {
    try {
      const user = req['user'];
      if (user.role !== UserRole.SP_ADMIN) {
        throw new ForbiddenException('Access denied');
      }
      const data = await this.transactionRepo.find({
        where: { barber_shop_id: user.id },
        order: { created_at: 'DESC' },
      });
      return successRes(data);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async findMyBarber(req: Request) {
    try {
      const user = req['user'];
      if (user.role !== UserRole.BARBER) {
        throw new ForbiddenException('Access denied');
      }
      const data = await this.transactionRepo.find({
        where: { barber_id: user.id },
        order: { created_at: 'DESC' },
      });
      return successRes(data);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async summary(req: Request, query: Record<string, any>) {
    try {
      const user = req['user'];
      const { start, end } = this.resolveDateRange(query);

      if (user.role === UserRole.SP_ADMIN) {
        const total = await this.sumBy(
          { barber_shop_id: user.id },
          start,
          end,
        );
        return successRes({ total_amount: total });
      }
      if (user.role === UserRole.BARBER) {
        const total = await this.sumBy({ barber_id: user.id }, start, end);
        return successRes({ total_amount: total });
      }
      if (
        user.role === UserRole.ADMIN ||
        user.role === UserRole.SUPPER_ADMIN
      ) {
        const total = await this.sumBy({}, start, end);
        return successRes({ total_amount: total });
      }
      throw new ForbiddenException('Access denied');
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async summaryChart(req: Request, query: Record<string, any>) {
    try {
      const user = req['user'];
      const { period = 'daily' } = query;
      const { start, end } = this.resolveDateRange(query);

      const bucket =
        period === 'monthly' ? 'month' : period === 'weekly' ? 'week' : 'day';
      const labelFormat =
        period === 'monthly'
          ? 'YYYY-MM'
          : period === 'weekly'
            ? 'IYYY-IW'
            : 'YYYY-MM-DD';

      let seriesQb = this.transactionRepo
        .createQueryBuilder('t')
        .select(
          `to_char(date_trunc('${bucket}', to_timestamp(t.created_at/1000)), '${labelFormat}')`,
          'label',
        )
        .addSelect('COALESCE(SUM(t.amount), 0)', 'total_amount')
        .groupBy('label')
        .orderBy('label', 'ASC');

      seriesQb = this.applyFilters(seriesQb, user, start, end);
      const series = await seriesQb.getRawMany();

      let paymentQb = this.transactionRepo
        .createQueryBuilder('t')
        .select('t.payment_model', 'payment_model')
        .addSelect('COALESCE(SUM(t.amount), 0)', 'total_amount')
        .groupBy('t.payment_model');
      paymentQb = this.applyFilters(paymentQb, user, start, end);
      const by_payment_model = await paymentQb.getRawMany();

      let statusQb = this.transactionRepo
        .createQueryBuilder('t')
        .select('t.payment_status', 'payment_status')
        .addSelect('COALESCE(SUM(t.amount), 0)', 'total_amount')
        .groupBy('t.payment_status');
      statusQb = this.applyFilters(statusQb, user, start, end);
      const by_payment_status = await statusQb.getRawMany();

      return successRes({
        period: bucket,
        start: start ? Math.floor(start.getTime()) : null,
        end: end ? Math.floor(end.getTime()) : null,
        series,
        by_payment_model,
        by_payment_status,
      });
    } catch (error) {
      return ErrorHender(error);
    }
  }

  private applyFilters(
    qb: SelectQueryBuilder<TransactionEntity>,
    user: any,
    start?: Date,
    end?: Date,
  ) {
    if (user.role === UserRole.SP_ADMIN) {
      qb.andWhere('t.barber_shop_id = :shopId', { shopId: user.id });
    } else if (user.role === UserRole.BARBER) {
      qb.andWhere('t.barber_id = :barberId', { barberId: user.id });
    }

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

    return qb;
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

  private async sumBy(where: Record<string, any>, start?: Date, end?: Date) {
    const qb = this.transactionRepo
      .createQueryBuilder('t')
      .select('COALESCE(SUM(t.amount), 0)', 'total')
      .where(where);

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
}

import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

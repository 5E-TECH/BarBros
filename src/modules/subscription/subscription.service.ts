import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { SubscriptionPlanEntity } from './entities/subscription-plan.entity';
import { SubscriptionEntity } from './entities/subscription.entity';
import { AssignSubscriptionDto } from './dto/assign-subscription.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { PaymentStatus, Status, SubscriptionStatus, UserRole } from 'src/common/enum';
import { BarberShopEntity } from 'src/modules/barber-shop/entities/barber-shop.entity';
import { BarberEntity } from 'src/modules/barber/entities/barber.entity';
import { successRes } from 'src/utils/succesResponse';
import { ErrorHender } from 'src/utils/catchError';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(SubscriptionPlanEntity)
    private readonly planRepo: Repository<SubscriptionPlanEntity>,
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepo: Repository<SubscriptionEntity>,
    @InjectRepository(BarberShopEntity)
    private readonly shopRepo: Repository<BarberShopEntity>,
    @InjectRepository(BarberEntity)
    private readonly barberRepo: Repository<BarberEntity>,
  ) {}

  async createPlan(dto: CreatePlanDto) {
    try {
      const plan = this.planRepo.create(dto);
      const saved = await this.planRepo.save(plan);
      return successRes(saved, 201);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async updatePlan(id: number, dto: UpdatePlanDto) {
    try {
      const plan = await this.planRepo.findOne({ where: { id } });
      if (!plan) throw new NotFoundException('Plan not found');
      await this.planRepo.update({ id }, dto);
      const updated = await this.planRepo.findOne({ where: { id } });
      return successRes(updated);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async listPlans() {
    try {
      const data = await this.planRepo.find({
        where: { is_active: true },
        order: { price: 'ASC' },
      });
      return successRes(data);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async assignSubscription(dto: AssignSubscriptionDto) {
    try {
      const plan = await this.planRepo.findOne({ where: { id: dto.plan_id } });
      if (!plan || !plan.is_active) {
        throw new NotFoundException('Plan not found');
      }

      const shop = await this.shopRepo.findOne({
        where: { id: dto.barber_shop_id },
      });
      if (!shop) throw new NotFoundException('BarberShop not found');

      const now = Date.now();
      const existing = await this.subscriptionRepo.findOne({
        where: {
          barber_shop_id: dto.barber_shop_id,
          status: SubscriptionStatus.ACTIVE,
          end_at: MoreThanOrEqual(now),
        },
        order: { end_at: 'DESC' },
      });

      const baseTime = existing ? existing.end_at : now;
      const endAt = this.addMonths(baseTime, plan.duration_months);

      const subscription = this.subscriptionRepo.create({
        barber_shop_id: dto.barber_shop_id,
        plan_id: dto.plan_id,
        start_at: existing ? baseTime : now,
        end_at: endAt,
        status: SubscriptionStatus.ACTIVE,
        payment_model: dto.payment_model,
        payment_status: PaymentStatus.PAID,
      });

      const saved = await this.subscriptionRepo.save(subscription);
      await this.shopRepo.update({ id: dto.barber_shop_id }, { status: Status.ACTIVE });
      return successRes(saved, 201);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async updateSubscription(id: number, dto: UpdateSubscriptionDto) {
    try {
      const sub = await this.subscriptionRepo.findOne({ where: { id } });
      if (!sub) throw new NotFoundException('Subscription not found');

      if (dto.plan_id) {
        const plan = await this.planRepo.findOne({ where: { id: dto.plan_id } });
        if (!plan) throw new NotFoundException('Plan not found');
      }

      await this.subscriptionRepo.update({ id }, dto);
      const updated = await this.subscriptionRepo.findOne({ where: { id } });
      return successRes(updated);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async listSubscriptions(query: Record<string, any>) {
    try {
      const { barber_shop_id } = query;
      const where = barber_shop_id ? { barber_shop_id: Number(barber_shop_id) } : {};
      const data = await this.subscriptionRepo.find({
        where,
        order: { created_at: 'DESC' },
      });
      return successRes(data);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async mySubscription(user: any) {
    try {
      if (user.role !== UserRole.SP_ADMIN) {
        throw new ForbiddenException('Access denied');
      }
      const data = await this.subscriptionRepo.find({
        where: { barber_shop_id: user.id },
        order: { end_at: 'DESC' },
      });
      return successRes(data);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async ensureActive(barberShopId: number) {
    const now = Date.now();
    const active = await this.subscriptionRepo.findOne({
      where: {
        barber_shop_id: barberShopId,
        status: SubscriptionStatus.ACTIVE,
        end_at: MoreThanOrEqual(now),
      },
      order: { end_at: 'DESC' },
    });

    if (active) {
      return true;
    }

    await this.shopRepo.update({ id: barberShopId }, { status: Status.INACTIVE });
    throw new ForbiddenException('Subscription expired');
  }

  async ensureActiveForUser(user: any) {
    if (!user) return true;
    if (user.role === UserRole.SP_ADMIN) {
      await this.ensureActive(user.id);
      return true;
    }
    if (user.role === UserRole.BARBER) {
      const barber = await this.barberRepo.findOne({
        where: { id: user.id },
        relations: ['barberShop'],
      });
      if (!barber?.barberShop) {
        throw new ForbiddenException('Barber shop not found');
      }
      await this.ensureActive(barber.barberShop.id);
    }
    return true;
  }

  private addMonths(baseMs: number, months: number) {
    const date = new Date(baseMs);
    const result = new Date(date.getTime());
    result.setMonth(result.getMonth() + months);
    return result.getTime();
  }
}

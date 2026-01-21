import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThan, Repository } from 'typeorm';
import { SubscriptionEntity } from './entities/subscription.entity';
import { SubscriptionStatus, Status } from 'src/common/enum';
import { BarberShopEntity } from 'src/modules/barber-shop/entities/barber-shop.entity';
import { NotificationEntity } from 'src/modules/notification/entities/notification.entity';

@Injectable()
export class SubscriptionCronService {
  constructor(
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepo: Repository<SubscriptionEntity>,
    @InjectRepository(BarberShopEntity)
    private readonly shopRepo: Repository<BarberShopEntity>,
    @InjectRepository(NotificationEntity)
    private readonly notificationRepo: Repository<NotificationEntity>,
  ) {}

  @Cron('0 * * * *')
  async checkSubscriptions() {
    const now = Date.now();
    const inThreeDays = now + 3 * 24 * 60 * 60 * 1000;

    const expiring = await this.subscriptionRepo.find({
      where: {
        status: SubscriptionStatus.ACTIVE,
        reminder_sent: false,
        end_at: LessThanOrEqual(inThreeDays),
      },
    });

    for (const sub of expiring) {
      await this.notificationRepo.save(
        this.notificationRepo.create({
          message: `Your subscription will expire soon (ends at ${new Date(
            sub.end_at,
          ).toISOString()})`,
          barber_shop_id: sub.barber_shop_id,
          is_read: false,
        }),
      );
      sub.reminder_sent = true;
      await this.subscriptionRepo.save(sub);
    }

    const expired = await this.subscriptionRepo.find({
      where: {
        status: SubscriptionStatus.ACTIVE,
        end_at: LessThanOrEqual(now),
      },
    });

    for (const sub of expired) {
      sub.status = SubscriptionStatus.EXPIRED;
      await this.subscriptionRepo.save(sub);
      await this.shopRepo.update(
        { id: sub.barber_shop_id },
        { status: Status.INACTIVE },
      );
      await this.notificationRepo.save(
        this.notificationRepo.create({
          message: `Your subscription has expired`,
          barber_shop_id: sub.barber_shop_id,
          is_read: false,
        }),
      );
    }
  }
}

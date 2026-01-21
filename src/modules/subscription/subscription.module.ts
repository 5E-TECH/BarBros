import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionPlanEntity } from './entities/subscription-plan.entity';
import { SubscriptionEntity } from './entities/subscription.entity';
import { BarberShopEntity } from 'src/modules/barber-shop/entities/barber-shop.entity';
import { BarberEntity } from 'src/modules/barber/entities/barber.entity';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { NotificationEntity } from 'src/modules/notification/entities/notification.entity';
import { SubscriptionCronService } from './subscription.reminder.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SubscriptionPlanEntity,
      SubscriptionEntity,
      BarberShopEntity,
      BarberEntity,
      NotificationEntity,
    ]),
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, SubscriptionCronService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}

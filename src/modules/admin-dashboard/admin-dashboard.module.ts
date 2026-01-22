import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminDashboardController } from './admin-dashboard.controller';
import { AdminDashboardService } from './admin-dashboard.service';
import { UserEntity } from 'src/modules/user/entities/user.admin,entity';
import { BarberShopEntity } from 'src/modules/barber-shop/entities/barber-shop.entity';
import { BarberEntity } from 'src/modules/barber/entities/barber.entity';
import { BookingEntity } from 'src/modules/booking/entities/booking.entity';
import { TransactionEntity } from 'src/modules/transactions/entities/transaction.entity';
import { ServiceEntity } from 'src/modules/service/entities/service.entity';
import { SubscriptionEntity } from 'src/modules/subscription/entities/subscription.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      BarberShopEntity,
      BarberEntity,
      BookingEntity,
      TransactionEntity,
      SubscriptionEntity,
      ServiceEntity,
    ]),
  ],
  controllers: [AdminDashboardController],
  providers: [AdminDashboardService],
})
export class AdminDashboardModule {}

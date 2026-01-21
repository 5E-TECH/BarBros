import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingEntity } from './entities/booking.entity';
import { BarberScheduleEntity } from '../barber_schedule/entities/barber_schedule.entity';
import { ServiceEntity } from 'src/modules/service/entities/service.entity';
import { BarberEntity } from 'src/modules/barber/entities/barber.entity';
import { BarberShopServicesEntity } from '../barber-shop-services/entities/barber-shop-services.entity';
import { TransactionEntity } from '../transactions/entities/transaction.entity';
import { NotificationEntity } from '../notification/entities/notification.entity';
import { BookingReminderService } from './booking-reminder.service';
import { UserEntity } from 'src/modules/user/entities/user.admin,entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BookingEntity,
      BarberScheduleEntity,
      ServiceEntity,
      BarberEntity,
      BarberShopServicesEntity,
      TransactionEntity,
      NotificationEntity,
      UserEntity,
    ]),
  ],
  controllers: [BookingController],
  providers: [BookingService, BookingReminderService],
})
export class BookingModule {}

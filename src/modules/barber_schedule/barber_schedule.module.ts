import { Module } from '@nestjs/common';
import { BarberScheduleService } from './barber_schedule.service';
import { BarberScheduleController } from './barber_schedule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BarberScheduleEntity } from './entities/barber_schedule.entity';
import { BarberEntity } from '../barber/entities/barber.entity';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BarberScheduleEntity, BarberEntity]),
    SubscriptionModule,
  ],
  controllers: [BarberScheduleController],
  providers: [BarberScheduleService],
})
export class BarberScheduleModule {}

import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingEntity } from '../../core/entity/booking.entity';
import { BarberScheduleEntity } from 'src/core/entity/barber_schedule.entity';
import { ServiceEntity } from 'src/core/entity/service.entity';
import { BarberEntity } from 'src/core/entity/barber.entity';

@Module({
  imports:[TypeOrmModule.forFeature([BookingEntity,BarberScheduleEntity,ServiceEntity, BarberEntity])],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}

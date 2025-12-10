import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingEntity } from './entities/booking.entity';
import { BarberScheduleEntity } from '../barber_schedule/entities/barber_schedule.entity';
import { ServiceEntity } from 'src/modules/service/entities/service.entity';
import { BarberEntity } from 'src/modules/barber/entities/barber.entity';

@Module({
  imports:[TypeOrmModule.forFeature([BookingEntity,BarberScheduleEntity,ServiceEntity, BarberEntity])],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}

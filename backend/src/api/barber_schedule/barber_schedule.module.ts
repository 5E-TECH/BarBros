import { Module } from '@nestjs/common';
import { BarberScheduleService } from './barber_schedule.service';
import { BarberScheduleController } from './barber_schedule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BarberScheduleEntity } from 'src/core/entity/barber_schedule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BarberScheduleEntity])],
  controllers: [BarberScheduleController],
  providers: [BarberScheduleService],
})
export class BarberScheduleModule {}

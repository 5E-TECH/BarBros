import { Module } from '@nestjs/common';
import { AutoLoudController } from './auto-loud.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReytingEntity } from '../rayting/entities/reyting.entity';
import { BarberEntity } from 'src/modules/barber/entities/barber.entity';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReytingEntity, BarberEntity]),
    ScheduleModule.forRoot(),
  ],
  controllers: [AutoLoudController],
})
export class AutoLoudModule {}

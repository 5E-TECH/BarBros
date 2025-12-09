import { Module } from '@nestjs/common';
import { AutoLoudController } from './auto-loud.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReytingEntity } from 'src/core/entity/reyting.entity';
import { BarberEntity } from 'src/core/entity/barber.entity';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReytingEntity, BarberEntity]),
    ScheduleModule.forRoot(),
  ],
  controllers: [AutoLoudController],
})
export class AutoLoudModule {}

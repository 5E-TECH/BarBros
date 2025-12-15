import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceEntity } from './entities/service.entity';
import { BarberEntity } from '../barber/entities/barber.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceEntity, BarberEntity])],
  controllers: [ServiceController],
  providers: [ServiceService],
})
export class ServiceModule {}

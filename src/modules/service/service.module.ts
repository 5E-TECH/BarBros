import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceEntity } from './entities/service.entity';
import { BarberEntity } from '../barber/entities/barber.entity';
import { CategoryEntitiy } from '../category/entitiy/category.entitiy';
import { BarberShopServicesEntity } from '../barber-shop-services/entities/barber-shop-services.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ServiceEntity,
      BarberEntity,
      CategoryEntitiy,
      BarberShopServicesEntity,
    ]),
  ],
  controllers: [ServiceController],
  providers: [ServiceService],
})
export class ServiceModule {}

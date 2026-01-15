import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BarberShopServicesService } from './barber-shop-services.service';
import { BarberShopServicesController } from './barber-shop-services.controller';
import { BarberShopServicesEntity } from './entities/barber-shop-services.entity';
import { BarberShopEntity } from 'src/modules/barber-shop/entities/barber-shop.entity';
import { ServiceEntity } from 'src/modules/service/entities/service.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BarberShopServicesEntity,
      BarberShopEntity,
      ServiceEntity,
    ]),
  ],
  controllers: [BarberShopServicesController],
  providers: [BarberShopServicesService],
  exports: [BarberShopServicesService],
})
export class BarberShopServicesModule {}

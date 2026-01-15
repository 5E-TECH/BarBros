import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceImageService } from './service-image.service';
import { ServiceImageController } from './service-image.controller';
import { ServiceImageEntity } from './entities/service-image.entity';
import { ServiceEntity } from 'src/modules/service/entities/service.entity';
import { BarberShopEntity } from 'src/modules/barber-shop/entities/barber-shop.entity';
import { BarberShopServicesEntity } from 'src/modules/barber-shop-services/entities/barber-shop-services.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ServiceImageEntity,
      ServiceEntity,
      BarberShopEntity,
      BarberShopServicesEntity,
    ]),
  ],
  controllers: [ServiceImageController],
  providers: [ServiceImageService],
})
export class ServiceImageModule {}

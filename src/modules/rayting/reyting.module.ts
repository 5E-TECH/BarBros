import { Module } from '@nestjs/common';
import { ReytingService } from './reyting.service';
import { ReytingController } from './reyting.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReytingEntity } from './entities/reyting.entity';
import { BarberEntity } from '../barber/entities/barber.entity';
import { BarberShopEntity } from '../barber-shop/entities/barber-shop.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReytingEntity, BarberEntity, BarberShopEntity])],
  controllers: [ReytingController],
  providers: [ReytingService],
})
export class ReytingModule {}

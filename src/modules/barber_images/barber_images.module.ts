import { Module } from '@nestjs/common';
import { BarberImagesService } from './barber_images.service';
import { BarberImagesController } from './barber_images.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BarberImageEntity } from './entities/barber_image.entity';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  imports:[TypeOrmModule.forFeature([BarberImageEntity]), SubscriptionModule],
  controllers: [BarberImagesController],
  providers: [BarberImagesService],
})
export class BarberImagesModule {}

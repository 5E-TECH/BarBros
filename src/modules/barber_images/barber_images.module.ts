import { Module } from '@nestjs/common';
import { BarberImagesService } from './barber_images.service';
import { BarberImagesController } from './barber_images.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BarberImageEntity } from './entities/barber_image.entity';

@Module({
  imports:[TypeOrmModule.forFeature([BarberImageEntity])],
  controllers: [BarberImagesController],
  providers: [BarberImagesService],
})
export class BarberImagesModule {}

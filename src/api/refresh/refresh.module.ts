import { Module } from '@nestjs/common';
import { RefreshController } from './refresh.controller';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BarberShopEntity } from 'src/core/entity/barber-shop.entity';

@Module({
  imports:[UserModule, TypeOrmModule.forFeature([BarberShopEntity])],
  controllers: [RefreshController],
})
export class RefreshModule {}

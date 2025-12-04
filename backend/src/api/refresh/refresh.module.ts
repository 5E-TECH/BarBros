import { Module } from '@nestjs/common';
import { RefreshController } from './refresh.controller';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BarberShopEntity } from 'src/core/entity/barber-shop.entity';
import { UserEntity } from 'src/core/entity/user.entity';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([BarberShopEntity, UserEntity]), // UserEntity qo'shildi
  ],
  controllers: [RefreshController],
})
export class RefreshModule {}

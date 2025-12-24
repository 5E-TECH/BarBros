import { Module } from '@nestjs/common';
import { RefreshController } from './refresh.controller';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BarberShopEntity } from '../barber-shop/entities/barber-shop.entity';
import { UserEntity } from 'src/modules/user/entities/user.admin,entity';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([BarberShopEntity, UserEntity]), 
  ],
  controllers: [RefreshController],
})
export class RefreshModule {}

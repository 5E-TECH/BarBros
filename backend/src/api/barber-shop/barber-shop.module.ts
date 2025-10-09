import { Module } from '@nestjs/common';
import { BarberShopService } from './barber-shop.service';
import { BarberShopController } from './barber-shop.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BarberShopEntity } from '../../core/entity/barber-shop.entity';
import { BcryptEncryption } from 'src/infrostructure/bcrypt';
import { OtpGenerate } from 'src/infrostructure/otp_generet/otp_generate';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([BarberShopEntity]),UserModule],
  controllers: [BarberShopController],
  providers: [BarberShopService, BcryptEncryption, OtpGenerate],
  exports: [BarberShopService]
})
export class BarberShopModule {}
BarberShopModule
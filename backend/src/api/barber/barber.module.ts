import { Module } from '@nestjs/common';
import { BarberService } from './barber.service';
import { BarberController } from './barber.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BarberEntity } from 'src/core/entity/barber.entity';
import { UserModule } from '../user/user.module';
import { BcryptEncryption } from 'src/infrostructure/bcrypt';
import { OtpGenerate } from 'src/infrostructure/otp_generet/otp_generate';

@Module({
  imports:[TypeOrmModule.forFeature([BarberEntity]),
  UserModule
],
  controllers: [BarberController],
  providers: [BarberService, BcryptEncryption, OtpGenerate],
})
export class BarberModule {}

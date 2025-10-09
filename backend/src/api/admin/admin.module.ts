import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/core/entity/user.entity';
import { BcryptEncryption } from 'src/infrostructure/bcrypt';
import { OtpGenerate } from 'src/infrostructure/otp_generet/otp_generate';

@Module({
  imports :[UserModule, TypeOrmModule.forFeature([UserEntity])],
  controllers: [AdminController],
  providers: [AdminService, BcryptEncryption, OtpGenerate],
})
export class AdminModule {}

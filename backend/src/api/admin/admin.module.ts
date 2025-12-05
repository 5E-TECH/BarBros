import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/core/entity/user.entity';
import { BcryptEncryption } from 'src/infrostructure/bcrypt';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [AdminController],
  providers: [AdminService, BcryptEncryption],
})
export class AdminModule {}

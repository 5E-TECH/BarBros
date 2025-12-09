import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BcryptEncryption } from 'src/infrostructure/bcrypt';
import { AdminEntity } from 'src/core/entity/admin-entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdminEntity])],
  controllers: [AdminController],
  providers: [AdminService, BcryptEncryption],
})
export class AdminModule {}

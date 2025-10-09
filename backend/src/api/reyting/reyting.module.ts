import { Module } from '@nestjs/common';
import { ReytingService } from './reyting.service';
import { ReytingController } from './reyting.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReytingEntity } from '../../core/entity/reyting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReytingEntity])],
  controllers: [ReytingController],
  providers: [ReytingService],
})
export class ReytingModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceImageService } from './service-image.service';
import { ServiceImageController } from './service-image.controller';
import { ServiceImageEntity } from './entities/service-image.entity';
import { ServiceEntity } from 'src/modules/service/entities/service.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ServiceImageEntity,
      ServiceEntity,
    ]),
  ],
  controllers: [ServiceImageController],
  providers: [ServiceImageService],
})
export class ServiceImageModule {}

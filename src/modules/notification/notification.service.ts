import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationEntity } from './entities/notification.entity';
import { Repository } from 'typeorm';
import { successRes } from 'src/utils/succesResponse';
import { ErrorHender } from 'src/utils/catchError';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
    private notifRepo: Repository<NotificationEntity>,
  ) {}

  async create(createNotificationDto: CreateNotificationDto) {
    try {
      const notification = this.notifRepo.create({ ...createNotificationDto });
      await this.notifRepo.save(notification);
      return successRes(notification, 201);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async findAll() {
    try {
      const notifications = await this.notifRepo.find();
      return successRes(notifications);
    } catch (error) {
      return ErrorHender(error);
    }
  }
  async delet(id: number){
    try {
      const data = await this.notifRepo.findOne({where: {id:id}})
      if(!data){
        throw new NotFoundException("Not fount notifikation")
      }
      const delet = await this.notifRepo.remove(data)
      return successRes(delet)
    } catch (error) {
      return ErrorHender(error)
    }
  }

}

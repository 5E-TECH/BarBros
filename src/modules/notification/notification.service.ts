import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationEntity } from './entities/notification.entity';
import { Repository } from 'typeorm';
import { successRes } from 'src/utils/succesResponse';
import { ErrorHender } from 'src/utils/catchError';
import { Request } from 'express';
import { UserRole } from 'src/common/enum';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
    private notifRepo: Repository<NotificationEntity>,
  ) {}

  async create(createNotificationDto: CreateNotificationDto) {
    try {
      if (!createNotificationDto.user_id && !createNotificationDto.barber_id) {
        throw new BadRequestException('user_id or barber_id is required');
      }
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

  async findMy(req: Request) {
    try {
      const user = req['user'];
      const where =
        user.role === UserRole.USER
          ? { user_id: user.id }
          : user.role === UserRole.BARBER
            ? { barber_id: user.id }
            : null;

      if (!where) {
        throw new BadRequestException('Invalid role');
      }

      const notifications = await this.notifRepo.find({ where });
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

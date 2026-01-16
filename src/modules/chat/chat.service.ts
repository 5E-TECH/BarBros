import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatEntity } from './entities/chat.entity';
import { CreateChatDto } from './dto/create-chat.dto';
import { ErrorHender } from 'src/utils/catchError';
import { successRes } from 'src/utils/succesResponse';
import { Request } from 'express';
import { UserEntity } from 'src/modules/user/entities/user.admin,entity';
import { BarberEntity } from 'src/modules/barber/entities/barber.entity';
import { UserRole } from 'src/common/enum';
import { FileService } from '../file/file.service';
import { ImageValidationPipe } from 'src/common/pipe/img-validation';
import { ChatGateway } from './chat.gateway';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatEntity)
    private readonly chatRepo: Repository<ChatEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(BarberEntity)
    private readonly barberRepo: Repository<BarberEntity>,
    private readonly fileService: FileService,
    private readonly chatGateway: ChatGateway,
  ) {}

  async create(dto: CreateChatDto, req: Request, file?: Express.Multer.File) {
    try {
      const user = req['user'];
      let userId: number | undefined;
      let barberId: number | undefined;

      if (user.role === UserRole.USER) {
        userId = user.id;
        barberId = dto.barber_id;
      } else if (user.role === UserRole.BARBER) {
        barberId = user.id;
        userId = dto.user_id;
      } else if (
        user.role === UserRole.SP_ADMIN ||
        user.role === UserRole.ADMIN ||
        user.role === UserRole.SUPPER_ADMIN
      ) {
        userId = dto.user_id;
        barberId = dto.barber_id;
      } else {
        throw new ForbiddenException('Access denied');
      }

      if (!userId || !barberId) {
        throw new BadRequestException('user_id and barber_id are required');
      }

      const [u, b] = await Promise.all([
        this.userRepo.findOne({ where: { id: userId } }),
        this.barberRepo.findOne({ where: { id: barberId } }),
      ]);

      if (!u) throw new NotFoundException('User not found');
      if (!b) throw new NotFoundException('Barber not found');

      if (!dto.message && !file) {
        throw new BadRequestException('message or image is required');
      }

      let image: string | null = null;
      if (file) {
        new ImageValidationPipe().transform(file);
        image = await this.fileService.createFile(file);
      }

      const chat = this.chatRepo.create({
        message: dto.message ?? null,
        image,
        user_id: userId,
        barber_id: barberId,
        sender_role: user.role,
      });

      const saved = await this.chatRepo.save(chat);
      this.chatGateway.emitNewMessage(saved);
      return successRes(saved, 201);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async getConversation(req: Request, userId?: number, barberId?: number) {
    try {
      const user = req['user'];
      let resolvedUserId = userId;
      let resolvedBarberId = barberId;

      if (user.role === UserRole.USER) {
        resolvedUserId = user.id;
        if (!resolvedBarberId) {
          throw new BadRequestException('barber_id is required');
        }
      } else if (user.role === UserRole.BARBER) {
        resolvedBarberId = user.id;
        if (!resolvedUserId) {
          throw new BadRequestException('user_id is required');
        }
      } else if (
        user.role === UserRole.SP_ADMIN ||
        user.role === UserRole.ADMIN ||
        user.role === UserRole.SUPPER_ADMIN
      ) {
        if (!resolvedUserId || !resolvedBarberId) {
          throw new BadRequestException('user_id and barber_id are required');
        }
      } else {
        throw new ForbiddenException('Access denied');
      }

      const data = await this.chatRepo.find({
        where: { user_id: resolvedUserId, barber_id: resolvedBarberId },
        order: { created_at: 'ASC' },
      });

      return successRes(data);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async getMyChats(req: Request) {
    try {
      const user = req['user'];
      if (user.role === UserRole.USER) {
        const data = await this.chatRepo.find({
          where: { user_id: user.id },
          order: { created_at: 'DESC' },
        });
        return successRes(data);
      }
      if (user.role === UserRole.BARBER) {
        const data = await this.chatRepo.find({
          where: { barber_id: user.id },
          order: { created_at: 'DESC' },
        });
        return successRes(data);
      }

      throw new ForbiddenException('Access denied');
    } catch (error) {
      return ErrorHender(error);
    }
  }
}

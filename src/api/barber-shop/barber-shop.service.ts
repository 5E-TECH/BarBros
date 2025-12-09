import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Request } from 'express';

import { BarberShopEntity } from 'src/core/entity/barber-shop.entity';
import { BarberRole } from 'src/common/enum';
import { BcryptEncryption } from 'src/infrostructure/bcrypt';
import { FileService } from '../file/file.service';
import { ImageValidationPipe } from 'src/common/pipe/img-validation';

import { CreateBarberShopDto } from './dto/create-barber-shop.dto';
import { UpdateBarberShopDto } from './dto/update-barber-shop.dto';
import { UpdateBarberShopStatus } from './dto/update-status';
import { LogimBarberShopDto } from './dto/login-barber-shop.dto';
import { RefreshPasswordDto } from '../admin/dto/RefreshPassword.dto';

import { successRes } from 'src/infrostructure/utils/succesResponse';
import { ErrorHender } from 'src/infrostructure/utils/catchError';

@Injectable()
export class BarberShopService {
  constructor(
    @InjectRepository(BarberShopEntity)
    private barberRepo: Repository<BarberShopEntity>,
    private readonly fileServis: FileService,
    private readonly Bcrypt: BcryptEncryption,
  ) {}

  // BarberShop yaratish
  async create(createDto: CreateBarberShopDto, file?: Express.Multer.File) {
    try {
      const exists = await this.barberRepo.findOne({ where: { name: createDto.name } });
      if (exists) throw new ConflictException('BarberShop name already exists');

      const barberShop = this.barberRepo.create(createDto);

      if (file && new ImageValidationPipe().transform(file)) {
        barberShop.img = await this.fileServis.createFile(file);
      }

      const saved = await this.barberRepo.save(barberShop);
      return successRes(saved, 201);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  // BarberShop login
  async login(dto: LogimBarberShopDto) {
    try {
      const shop = await this.barberRepo.findOne({ where: { email: dto.email } });
      if (!shop) throw new ForbiddenException('Wrong email');
      if (shop.role !== BarberRole.BARBER_SHOP) throw new ForbiddenException('Forbidden');
      if (!shop.status) throw new ForbiddenException('Your account is blocked');

      const isMatch = await this.Bcrypt.Verify(dto.password, shop.password);
      if (!isMatch) throw new ForbiddenException('Wrong password');

      return { message: 'Login successful' };
    } catch (error) {
      return ErrorHender(error);
    }
  }

  // BarberShop malumotlarini olish
  async myAccount(req: Request) {
    try {
      const user = req['user'];
      if (user.role !== BarberRole.BARBER_SHOP) throw new ForbiddenException('Forbidden');

      const shop = await this.barberRepo.findOne({ where: { id: user.id } });
      return successRes(shop);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  // Barcha BarberShoplar
  async findAll(query: Record<string, any>) {
    try {
      const { name, descripton, location, sortBy = 'name', order = 'DESC', page = 1, limit = 10 } = query;
      const skip = (Number(page) - 1) * Number(limit);

      const [data, total] = await this.barberRepo.findAndCount({
        where: {
          ...(name && { name: ILike(`%${name}%`) }),
          ...(descripton && { descripton: ILike(`%${descripton}%`) }),
          ...(location && { location: ILike(`%${location}%`) }),
        },
        relations: ['barber', 'images'],
        order: { [sortBy]: order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC' },
        skip,
        take: Number(limit),
      });

      if (!data.length) throw new NotFoundException('No BarberShops found');

      return successRes({
        data,
        total,
        currentPage: Number(page),
        pageSize: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      });
    } catch (error) {
      return ErrorHender(error);
    }
  }

  // BarberShop malumotlarini yangilash
  async update(id: number, updateDto: UpdateBarberShopDto, file?: Express.Multer.File, req?: Request) {
    try {
      const shop = await this.barberRepo.findOne({ where: { id } });
      if (!shop) throw new NotFoundException('BarberShop not found');
      if (req && shop.id !== req['user'].id) throw new ForbiddenException('Cannot update other BarberShop');

      if (file && new ImageValidationPipe().transform(file)) {
        if (shop.img && await this.fileServis.existFile(shop.img)) {
          await this.fileServis.deleteFile(shop.img);
        }
        updateDto.img = await this.fileServis.createFile(file);
      }

      await this.barberRepo.update({ id }, updateDto);
      const updated = await this.barberRepo.findOne({ where: { id } });
      return successRes(updated);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  // BarberShop o'chirish
  async remove(id: number) {
    try {
      const shop = await this.barberRepo.findOne({ where: { id } });
      if (!shop) throw new NotFoundException('BarberShop not found');

      await this.barberRepo.delete(id);

      if (shop.img && await this.fileServis.existFile(shop.img)) {
        await this.fileServis.deleteFile(shop.img);
      }

      return successRes({});
    } catch (error) {
      return ErrorHender(error);
    }
  }

  // BarberShop status yangilash
  async statusUpdate(id: number, newData: UpdateBarberShopStatus) {
    try {
      const shop = await this.barberRepo.findOne({ where: { id } });
      if (!shop) throw new NotFoundException('BarberShop not found');

      await this.barberRepo.update(id, { status: newData.status });
      const updated = await this.barberRepo.findOne({ where: { id } });
      return successRes(updated);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  // Parolni yangilash
  async refreshPassword(data: RefreshPasswordDto) {
    try {
      const shop = await this.barberRepo.findOne({ where: { email: data.email } });
      if (!shop) throw new NotFoundException('BarberShop not found');

      if (!data.new_password) throw new BadRequestException('New password is required');

      const hashPass = await this.Bcrypt.Generate(data.new_password);
      await this.barberRepo.update({ id: shop.id }, { password: hashPass });

      return { message: 'Password updated successfully', statusCode: 201 };
    } catch (error) {
      return ErrorHender(error);
    }
  }

  // Id orqali BarberShop olish
  async findOne(id: number) {
    try {
      const shop = await this.barberRepo.findOne({ where: { id }, relations: ['barber', 'images'] });
      if (!shop) throw new NotFoundException('BarberShop not found');
      if (!shop.status) throw new NotFoundException('BarberShop is blocked by admin');
      return successRes(shop);
    } catch (error) {
      return ErrorHender(error);
    }
  }
}

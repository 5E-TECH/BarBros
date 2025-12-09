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

import { BarberEntity } from 'src/core/entity/barber.entity';
import { BarberRole } from 'src/common/enum';
import { BcryptEncryption } from 'src/infrostructure/bcrypt';
import { JwtService } from '@nestjs/jwt';
import { FileService } from '../file/file.service';
import { ImageValidationPipe } from 'src/common/pipe/img-validation';

import { RegisterBarberDto } from './dto/register-barber.dto';
import { LoginBarberDto } from './dto/login-barber.dto';
import { UpdateBarberDto } from './dto/update-barber.dto';
import { RefreshPasswordDto } from '../admin/dto/RefreshPassword.dto';

import { AccessToken, RefreshToken } from 'src/infrostructure/utils/Acses-Refresh-token';
import { successRes } from 'src/infrostructure/utils/succesResponse';
import { ErrorHender } from 'src/infrostructure/utils/catchError';

@Injectable()
export class BarberService {
  constructor(
    @InjectRepository(BarberEntity)
    private readonly BarberRepo: Repository<BarberEntity>,
    private readonly Bcrypt: BcryptEncryption,
    private readonly fileServis: FileService,
    private readonly jwtService: JwtService,
  ) {}

  // Barber ro'yxatdan o'tkazish
  async register(registerBarberDto: RegisterBarberDto, file?: Express.Multer.File) {
    try {
      const existing = await this.BarberRepo.findOne({ where: { email: registerBarberDto.email } });
      if (existing) throw new ConflictException('Barber email already exists');

      const hashPass = await this.Bcrypt.Generate(registerBarberDto.password);

      const newBarber = this.BarberRepo.create({
        ...registerBarberDto,
        password: hashPass,
        role: BarberRole.BARBER,
      });

      if (file && new ImageValidationPipe().transform(file)) {
        const img = await this.fileServis.createFile(file);
        newBarber.img = img;
      }

      await this.BarberRepo.save(newBarber);
      return successRes(newBarber, 201);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  // Barber login
  async login(loginBarberDto: LoginBarberDto) {
    try {
      const barber = await this.BarberRepo.findOne({ where: { email: loginBarberDto.email } });
      if (!barber) throw new ForbiddenException('Wrong email');

      if (barber.role !== BarberRole.BARBER) throw new ForbiddenException('Forbidden');

      const isMatch = await this.Bcrypt.Verify(loginBarberDto.password, barber.password);
      if (!isMatch) throw new ForbiddenException('Wrong password');

      const accessToken = AccessToken(this.jwtService, { id: barber.id, role: barber.role });
      const refreshToken = RefreshToken(this.jwtService, { id: barber.id, role: barber.role });

      return { accessToken, refreshToken };
    } catch (error) {
      return ErrorHender(error);
    }
  }

  // Barber account malumotlarini olish
  async myAccount(req: Request) {
    try {
      const user = req['user'];
      if (user.role !== BarberRole.BARBER) throw new ForbiddenException('Forbidden');

      const barber = await this.BarberRepo.findOne({ where: { id: user.id } });
      return successRes(barber);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  // Barcha barberlarni olish
  async findAll(query: Record<string, any>) {
    try {
      const { full_name, phone_number, email, bio, sortBy = 'full_name', order = 'DESC', page = 1, limit = 10 } = query;
      const skip = (Number(page) - 1) * Number(limit);

      const [data, total] = await this.BarberRepo.findAndCount({
        where: {
          role: BarberRole.BARBER,
          ...(full_name && { full_name: ILike(`%${full_name}%`) }),
          ...(phone_number && { phone_number: ILike(`%${phone_number}%`) }),
          ...(email && { email: ILike(`%${email}%`) }),
          ...(bio && { bio: ILike(`%${bio}%`) }),
        },
        relations: ['reyting', 'service', 'barberShop', 'barberSchuld', 'barberImage', 'booking'],
        order: { [sortBy]: order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC' },
        skip,
        take: Number(limit),
      });

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

  // Barber malumotlarini yangilash
  async update(id: string, updateBarberDto: UpdateBarberDto, file?: Express.Multer.File) {
    try {
      const barber = await this.BarberRepo.findOne({ where: { id } });
      if (!barber) throw new NotFoundException('Barber not found');

      if (file) {
        if (barber.img && await this.fileServis.existFile(barber.img)) {
          await this.fileServis.deleteFile(barber.img);
        }
        const img = await this.fileServis.createFile(file);
        updateBarberDto.img = img;
      }

      await this.BarberRepo.update(id, updateBarberDto);
      const updated = await this.BarberRepo.findOne({ where: { id } });
      return successRes(updated);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  // Barberni o'chirish
  async remove(id: string) {
    try {
      const barber = await this.BarberRepo.findOne({ where: { id } });
      if (!barber) throw new NotFoundException('Barber not found');

      await this.BarberRepo.remove(barber);
      return successRes(barber);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  // Parolni yangilash
  async refreshPassword(data: RefreshPasswordDto) {
    try {
      const barber = await this.BarberRepo.findOne({ where: { email: data.email } });
      if (!barber) throw new NotFoundException('Barber not found');

      if (!data.new_password) throw new BadRequestException('New password is required');

      const hashPass = await this.Bcrypt.Generate(data.new_password);
      await this.BarberRepo.update({ id: barber.id }, { password: hashPass });

      return { message: "Password updated successfully", statusCode: 201 };
    } catch (error) {
      return ErrorHender(error);
    }
  }

  // Id orqali barber olish
  async findOne(id: string) {
    try {
      const barber = await this.BarberRepo.findOne({
        where: { id },
        relations: ['reyting', 'service', 'barberShop', 'barberSchuld', 'barberImage', 'booking'],
      });
      if (!barber) throw new NotFoundException('Barber not found');
      return successRes(barber);
    } catch (error) {
      return ErrorHender(error);
    }
  }
}

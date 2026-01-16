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

import { BarberEntity } from 'src/modules/barber/entities/barber.entity';
import { UserRole } from 'src/common/enum';
import { BcryptEncryption } from 'src/infrostructure/bcrypt';
import { JwtService } from '@nestjs/jwt';
import { FileService } from '../file/file.service';
import { ImageValidationPipe } from 'src/common/pipe/img-validation';

import { RegisterBarberDto } from './dto/register-barber.dto';
import { LoginBarberDto } from './dto/login-barber.dto';
import { UpdateBarberDto } from './dto/update-barber.dto';

import { AccessToken, RefreshToken } from 'src/utils/Acses-Refresh-token';
import { successRes } from 'src/utils/succesResponse';
import { ErrorHender } from 'src/utils/catchError';
import { BarberRefreshPasswordDto } from './dto/refreshPassword.doo';

@Injectable()
export class BarberService {
  constructor(
    @InjectRepository(BarberEntity)
    private readonly BarberRepo: Repository<BarberEntity>,
    private readonly Bcrypt: BcryptEncryption,
    private readonly fileServis: FileService,
    private readonly jwtService: JwtService,
  ) {}

  async create(
    registerBarberDto: RegisterBarberDto,
    barbershop_id: number,
    file?: Express.Multer.File,
  ) {
    try {
      const existing = await this.BarberRepo.findOne({
        where: { username: registerBarberDto.username },
      });
      if (existing)
        throw new ConflictException('Barber username already exists');

      const existingPhone_Number = await this.BarberRepo.findOne({
        where: { phone_number: registerBarberDto.phone_number },
      });
      if (existingPhone_Number)
        throw new ConflictException('Barber Phone number already exists');

      const hashPass = await this.Bcrypt.Generate(registerBarberDto.password);

      const newBarber = this.BarberRepo.create({
        ...registerBarberDto,
        password: hashPass,
        role: UserRole.BARBER,
        barberShop: { id: barbershop_id },
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

  async login(loginBarberDto: LoginBarberDto) {
    try {
      const barber = await this.BarberRepo.findOne({
        where: { username: loginBarberDto.username },
      });
      if (!barber) throw new ForbiddenException('Wrong email');

      if (barber.role !== UserRole.BARBER)
        throw new ForbiddenException('Forbidden');

      const isMatch = await this.Bcrypt.Verify(
        loginBarberDto.password,
        barber.password,
      );
      if (!isMatch) throw new ForbiddenException('Wrong password');

      const accessToken = AccessToken(this.jwtService, {
        id: barber.id,
        role: barber.role,
      });
      const refreshToken = RefreshToken(this.jwtService, {
        id: barber.id,
        role: barber.role,
      });

      return { accessToken, refreshToken };
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async myAccount(req: Request) {
    try {
      const user = req['user'];
      if (user.role !== UserRole.BARBER)
        throw new ForbiddenException('Forbidden');

      const barber = await this.BarberRepo.findOne({ where: { id: user.id } });
      return successRes(barber);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async findAll(query: Record<string, any>) {
    try {
      const {
        full_name,
        phone_number,
        email,
        bio,
        sortBy = 'full_name',
        order = 'DESC',
        page = 1,
        limit = 10,
      } = query;
      const skip = (Number(page) - 1) * Number(limit);

      const [data, total] = await this.BarberRepo.findAndCount({
        where: {
          role: UserRole.BARBER,
          ...(full_name && { full_name: ILike(`%${full_name}%`) }),
          ...(phone_number && { phone_number: ILike(`%${phone_number}%`) }),
          ...(email && { email: ILike(`%${email}%`) }),
          ...(bio && { bio: ILike(`%${bio}%`) }),
        },
        relations: [
          'reyting',
          'service',
          'barberShop',
          'barberSchuld',
          'barberImage',
          'booking',
        ],
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

  async findAllMyBarbers(user: any, query: Record<string, any>) {
    try {
      const {
        full_name,
        phone_number,
        email,
        bio,
        sortBy = 'full_name',
        order = 'DESC',
        page = 1,
        limit = 10,
      } = query;

      const skip = (Number(page) - 1) * Number(limit);

      const [data, total] = await this.BarberRepo.findAndCount({
        where: {
          role: UserRole.BARBER,
          barberShop: { id: user.id }, // 🔥 faqat o‘zining barberlari
          ...(full_name && { full_name: ILike(`%${full_name}%`) }),
          ...(phone_number && { phone_number: ILike(`%${phone_number}%`) }),
          ...(email && { email: ILike(`%${email}%`) }),
          ...(bio && { bio: ILike(`%${bio}%`) }),
        },
        relations: [
          'reyting',
          'service',
          'barberSchuld',
          'barberImage',
          'booking',
        ],
        order: {
          [sortBy]: order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC',
        },
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

  async update(
    id: number,
    updateBarberDto: UpdateBarberDto,
    req: Request,
    file?: Express.Multer.File,
  ) {
    try {
      const barber = await this.BarberRepo.findOne({ where: { id } });
      if (!barber) throw new NotFoundException('Barber not found');

      await this.assertBarberAccess(id, req);

      if (file) {
        if (barber.img && (await this.fileServis.existFile(barber.img))) {
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

  async remove(id: number, req: Request) {
    try {
      const barber = await this.BarberRepo.findOne({ where: { id } });
      if (!barber) throw new NotFoundException('Barber not found');

      await this.assertBarberAccess(id, req);

      await this.BarberRepo.remove(barber);
      return successRes(barber);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async refreshPassword(data: BarberRefreshPasswordDto, req: Request) {
    try {
      const user = req['user'];
      if (user.role !== UserRole.BARBER) {
        throw new ForbiddenException('Forbidden');
      }
      const barber = await this.BarberRepo.findOne({ where: { id: user.id } });
      if (!barber) throw new NotFoundException('Barber not found');

      if (!data.new_password)
        throw new BadRequestException('New password is required');

      const hashPass = await this.Bcrypt.Generate(data.new_password);
      await this.BarberRepo.update({ id: barber.id }, { password: hashPass });

      return { message: 'Password updated successfully', statusCode: 201 };
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async findOne(id: number) {
    try {
      const barber = await this.BarberRepo.findOne({
        where: { id },
        relations: [
          'reyting',
          'service',
          'barberShop',
          'barberSchuld',
          'barberImage',
          'booking',
        ],
      });
      if (!barber) throw new NotFoundException('Barber not found');
      return successRes(barber);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async findBarbershopId(id: number) {
    try {
      const barber = await this.BarberRepo.find({
        where: { barberShop: { id } },
        relations: [
          'reyting',
          'service',
          // 'barberShop',
          'barberSchuld',
          'barberImage',
          'booking',
        ],
      });
      if (!barber) throw new NotFoundException('Barber not found');
      return successRes(barber);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  private async assertBarberAccess(barberId: number, req: Request) {
    const user = req['user'];
    if (!user) throw new ForbiddenException('Forbidden');

    if (user.role === UserRole.BARBER) {
      if (user.id !== barberId) {
        throw new ForbiddenException('Access denied');
      }
      return;
    }

    if (user.role === UserRole.SP_ADMIN) {
      const barber = await this.BarberRepo.findOne({
        where: { id: barberId },
        relations: ['barberShop'],
      });
      if (!barber) throw new NotFoundException('Barber not found');
      if (!barber.barberShop || barber.barberShop.id !== user.id) {
        throw new ForbiddenException('Access denied');
      }
      return;
    }

    if (user.role === UserRole.SUPPER_ADMIN || user.role === UserRole.ADMIN) {
      return;
    }

    throw new ForbiddenException('Access denied');
  }
}
  }

   async findBarbershopId(id: number) {
    try {
      const barber = await this.BarberRepo.find({
        where: {barberShop:{ id }},
        relations: [
          'reyting',
          'service',
          // 'barberShop',
          'barberSchuld',
          'barberImage',
          'booking',
        ],
      });
      if (!barber) throw new NotFoundException('Barber not found');
      return successRes(barber);
    } catch (error) {
      return ErrorHender(error);
    }
  }
}

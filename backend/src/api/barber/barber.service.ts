import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateBarberDto } from './dto/update-barber.dto';
import { RegisterBarberDto } from './dto/register-barber.dto';
import { LoginBarberDto } from './dto/login-barber.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BarberEntity } from 'src/core/entity/barber.entity';
import { ILike, Repository } from 'typeorm';
import { BcryptEncryption } from 'src/infrostructure/bcrypt';
import { successRes } from 'src/infrostructure/utils/succesResponse';
import { ErrorHender } from 'src/infrostructure/utils/catchError';
import { OtpGenerate } from 'src/infrostructure/otp_generet/otp_generate';
import { MailService } from 'src/common/mail/mail.service';
import { FileService } from '../file/file.service';
import { ImageValidationPipe } from 'src/common/pipe/img-validation';
import { Request } from 'express';
import { BarberRole } from 'src/common/enum';
import { RefreshPasswortDto } from '../admin/dto/RefreshPassword.dto';
import {
  AccessToken,
  RefreshToken,
} from '../../infrostructure/utils/Acses-Refresh-token';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class BarberService {
constructor(
    @InjectRepository(BarberEntity)
    private readonly BarberRepo: Repository<BarberEntity>,
    private readonly Bcrypt: BcryptEncryption,
    private readonly Otp: OtpGenerate,
    private readonly Mail: MailService,
    private readonly fileServis: FileService,
    private readonly jwtService: JwtService,
) {}
  
  async register(
    registerBarberDto: RegisterBarberDto,
    file: Express.Multer.File,
  ) {
    try {
      const data = await this.BarberRepo.findOne({
        where: { email: registerBarberDto.email },
      });
      if (data) {
        throw new ConflictException('Barber email alredy exists');
      }
      const hashPass = await this.Bcrypt.Generate(registerBarberDto.password);
      let newBarber = {
        ...registerBarberDto,
        password: hashPass,
      };
      if (file && new ImageValidationPipe().transform(file)) {
        const img = await this.fileServis.createFile(file);
        const Barber = this.BarberRepo.create({ ...newBarber, img });
        await this.BarberRepo.save(Barber);
        return successRes(Barber, 201);
      } else {
        const Barber = this.BarberRepo.create(newBarber);
        await this.BarberRepo.save(Barber);
        return successRes(Barber, 201);
      }
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async login(loginBarberDto: LoginBarberDto) {
    try {
      const data = await this.BarberRepo.findOne({
        where: { email: loginBarberDto.email },
      });
      if (!data) throw new ForbiddenException('Wrong email');
      if (data.role != BarberRole.BARBER)
        throw new ForbiddenException('Forbidden');
      if (!(await this.Bcrypt.Verify(loginBarberDto.password, data.password)))
        throw new ForbiddenException('Wrong password');

      const accessToken = AccessToken(this.jwtService, {
        id: data.id,
        role: data.role,
      });

      const refreshToken = RefreshToken(this.jwtService, {
        id: data.id,
        role: data.role,
      });

      return { accessToken, refreshToken };
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async findAll(query: Record<string, any>) {
    try {
      const {
        phone_number,
        full_name,
        email,
        bio,
        sortBy = 'full_name',
        order = 'DESC',
        page = 1,
        limit = 10,
      } = query;

      const skip = (Number(page) - 1) * Number(limit);
      const role = BarberRole.BARBER;
      const barberRepo = await this.BarberRepo.find();
      if (!barberRepo.length) {
        throw new NotFoundException('Not faund data');
      }
      const [data, total] = await this.BarberRepo.findAndCount({
        where: {
          ...(full_name && { full_name: ILike(`%${full_name}%`) }),
          ...(phone_number && { phone_number: ILike(`%${phone_number}%`) }),
          ...(email && { email: ILike(`%${email}%`) }),
          ...(bio && { bio: ILike(`%${bio}%`) }),
          ...(role && { role: ILike(`%${role}%`) }),
        },
        relations: [
          'reyting',
          'service',
          'barberShop',
          'barberSchuld',
          'barberImage',
          'booking',
        ],
        select: [
          'full_name',
          'email',
          'img',
          'phone_number',
          'bio',
          'id',
          'is_avaylbl',
          'avg_reyting',
          'barberShop_id',
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
  async My_accaunt(req: Request) {
    try {
      let user = req['user'];

      if (user.role != BarberRole.BARBER) {
        throw new ForbiddenException('Forbidden');
      }
      const data = await this.BarberRepo.findOneBy({ id: user.id });
      return successRes(data);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async findOne(id: string) {
    try {
      const data = await this.BarberRepo.findOne({
        where: { id },
        relations: [
          'reyting',
          'service',
          'barberShop',
          'barberSchuld',
          'barberImage',
          'booking',
        ],
        select: [
          'full_name',
          'email',
          'img',
          'phone_number',
          'bio',
          'id',
          'is_avaylbl',
          'avg_reyting',
          'barberShop_id',
        ],
      });
      if (!data) {
        throw new NotFoundException('Not Fount barber');
      }
      return successRes(data);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async update(
    id: string,
    updateBarberDto: UpdateBarberDto,
    file: Express.Multer.File,
  ) {
    try {
      const data = await this.BarberRepo.findOneBy({ id });
      if (!data) {
        throw new NotFoundException('Not Fount barber');
      }
      if (file) {
        if (data.img) {
          if (await this.fileServis.existFile(data.img)) {
            await this.fileServis.deleteFile(data.img);
          }
        }
        const img = await this.fileServis.createFile(file);
        await this.BarberRepo.update(id, { ...updateBarberDto, img: img });
        let newBarber = await this.BarberRepo.findOne({
          where: { id },
          select: [
            'full_name',
            'email',
            'img',
            'phone_number',
            'bio',
            'id',
            'is_avaylbl',
            'avg_reyting',
            'barberShop_id',
          ],
        });
        return successRes(newBarber);
      } else {
        await this.BarberRepo.update(id, updateBarberDto);
        let newBarber = await this.BarberRepo.findOne({
          where: { id },
          select: [
            'full_name',
            'email',
            'img',
            'phone_number',
            'bio',
            'id',
            'is_avaylbl',
            'avg_reyting',
            'barberShop_id',
          ],
        });
        return successRes(newBarber);
      }
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async remove(id: string) {
    try {
      const data = await this.BarberRepo.findOneBy({ id });
      if (!data) {
        throw new NotFoundException('Not Fount barber');
      }
      let deleted = await this.BarberRepo.remove(data);
      return successRes(deleted);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async RefreshPassword(refreshPasswortDto: RefreshPasswortDto) {
    try {
      const data = await this.BarberRepo.findOne({
        where: { email: refreshPasswortDto.email },
      });
      if (!data) {
        throw new NotFoundException('Not fount data');
      }
      if (data.role != BarberRole.BARBER) {
        throw new ForbiddenException('Forbidden');
      }
      if (refreshPasswortDto.otp && refreshPasswortDto.new_password) {
        let isOtp = await this.Otp.verify(
          refreshPasswortDto.email,
          refreshPasswortDto.otp,
        );
        if (!isOtp) {
          throw new BadRequestException('Wrong otp');
        }
        let hashPass = await this.Bcrypt.Generate(
          refreshPasswortDto.new_password,
        );
        await this.BarberRepo.update({ id: data.id }, { password: hashPass });
        return {
          message: "Parolingiz muvofiyaqatliy o'zgartirildi",
          statusCode: 201,
        };
      }
    } catch (error) {
      return ErrorHender(error);
    }
  }
}

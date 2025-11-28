import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { CreateBarberShopDto } from './dto/create-barber-shop.dto';
import { UpdateBarberShopDto } from './dto/update-barber-shop.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BarberShopEntity } from '../../core/entity/barber-shop.entity';
import { ILike, Repository } from 'typeorm';
import { ErrorHender } from 'src/infrostructure/utils/catchError';
import { successRes } from 'src/infrostructure/utils/succesResponse';
import { error } from 'console';
import { UpdateBarberShopStatus } from './dto/update-status';
import { FileService } from '../file/file.service';
import { ImageValidationPipe } from 'src/common/pipe/img-validation';
import { LogimBarberShopDto } from './dto/login-barber-shop.dto';
import { BcryptEncryption } from 'src/infrostructure/bcrypt';
import { OtpGenerate } from 'src/infrostructure/otp_generet/otp_generate';
import { MailService } from 'src/common/mail/mail.service';
import { OtpBarberShopDto } from './dto/Otp-barber-shop.dto';
import { UserService } from '../user/user.service';
import { Request } from 'express';
import { BarberRole } from 'src/common/enum';
import { RefreshPasswortDto } from '../admin/dto/RefreshPassword.dto';

@Injectable()
export class BarberShopService {
  constructor(
    @InjectRepository(BarberShopEntity)
    private barberRepo: Repository<BarberShopEntity>,
    private readonly fileservis: FileService,
    private readonly Bcrypt: BcryptEncryption,
    private readonly Otp: OtpGenerate,
    private readonly Mail: MailService,
    private readonly UserRepo: UserService,
  ) {}
  async create(
    createBarberShopDto: CreateBarberShopDto,
    file: Express.Multer.File,
  ) {
    try {
      const existsName = await this.barberRepo.findOne({
        where: { name: createBarberShopDto.name },
      });
      if (existsName) {
        throw new ConflictException('name address alordy exists');
      }
      if (file && (await new ImageValidationPipe().transform(file))) {
        const img = await this.fileservis.createFile(file);
        const data = this.barberRepo.create({
          ...createBarberShopDto,
          img: img,
        });
        const newdata = await this.barberRepo.save(data);
        return successRes(newdata, 201);
      } else {
        const data = this.barberRepo.create(createBarberShopDto);
        const newdata = await this.barberRepo.save(data);
        return successRes(newdata, 201);
      }
    } catch (error) {
      ErrorHender(error);
    }
  }
  async login(logimBarberShopDto: LogimBarberShopDto) {
    try {
      const data = await this.barberRepo.findOne({
        where: { email: logimBarberShopDto.email },
      });
      if (!data) {
        throw new ForbiddenException('Wrong email');
      }
      if (data.role != BarberRole.BARBER_SHOP) {
        throw new ForbiddenException('Forbidden');
      }
      if (!data.status) {
        throw new ForbiddenException('Siz Admin tomonidan bloklangansiz');
      }
      if (
        !( this.Bcrypt.Verify(logimBarberShopDto.password, data.password))
      ) {
        throw new ForbiddenException('Wrong password');
      }
      let otp = await this.Otp.Generate(String(data.email));
      await this.Mail.sendMail(
        data.email,
        'Sizning tasdiqlash kodingiz:',
        `<div><h3>Ushbu kodni hechkimga bermayng uni faqat firibgarlar so'raydi Kod:<h1><b>${otp}</b></h1><h3></div>`,
      );
      return {
        message: `Akauntingizni tasdiqlash uchun quyidagi emailga ${data.email} habar yuborildi.`,
      };
    } catch (error) {
      return ErrorHender(error);
    }
  }
  async verifyOtp(data: OtpBarberShopDto) {
    try {
      let Otp = await this.Otp.verify(String(data.email), data.otp);
      if (!Otp) {
        throw new UnprocessableEntityException('Wrong otp');
      }
      const BarberShop = await this.barberRepo.findOne({
        where: { email: data.email },
      });
      if (!BarberShop) {
        throw new NotFoundException('BarberShop email not fount');
      }
      const acsesToken = this.UserRepo.AcsesToken({
        id: BarberShop.id,
        role: BarberShop.role,
      });
      const refreshToken = this.UserRepo.RefreshToken({
        id: BarberShop.id,
        role: BarberShop.role,
      });
      return { acsesToken, refreshToken };
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async findAll(query: Record<string, any>) {
    try {
      const {
        name,
        descripton,
        location,
        sortBy = 'name',
        order = 'DESC',
        page = 1,
        limit = 10,
      } = query;

      const skip = (Number(page) - 1) * Number(limit);
      const Barbershop = await this.barberRepo.find()
      if(!Barbershop.length){
        throw new NotFoundException("Not faund data")
      }
      const [data, total] = await this.barberRepo.findAndCount({
        where: {
          ...(name && { name: ILike(`%${name}%`) }),
          ...(descripton && { descripton: ILike(`%${descripton}%`) }),
          ...(location && {location: ILike(`%${location}%`)})
        },
        order: {
          [sortBy]: order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC',
        },
        relations: ['barber', 'images'],
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

      if (user.role != BarberRole.BARBER_SHOP) {
        throw new ForbiddenException('Forbidden');
      }
      const data = await this.barberRepo.findOneBy({ id: user.id });
      return successRes(data);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async findOne(id: string) {
    try {
      const data = await this.barberRepo.findOne({ where: { id }, relations: ['barber', 'images'], });
      if (!data) {
        throw new NotFoundException('Not Fount BarberShop');
      }
      if (!data.status) {
        throw new NotFoundException('BarberShop Admin tomonidan bloklangan');
      }
      return successRes(data);
    } catch (error) {
      ErrorHender(error);
    }
  }

  async update(
    id: string,
    updateBarberShopDto: UpdateBarberShopDto,
    file: Express.Multer.File,
    req: Request,
  ) {
    try {
      const data = await this.barberRepo.findOne({ where: { id } });
      if (!data) {
        throw new NotFoundException('Not Fount barber Shop');
      }
      if (data.id !== req['user'].id) {
        throw new ForbiddenException(
          "Siz boshqa Barber shop malumotlarini o'zgartira olmaysiz",
        );
      }
      if (file && new ImageValidationPipe().transform(file)) {
        const img = await this.fileservis.createFile(file);
        await this.barberRepo.update(
          { id },
          { ...updateBarberShopDto, img: img },
        );
        if (data.img) {
          if (await this.fileservis.existFile(data.img)) {
            await this.fileservis.deleteFile(data.img);
          }
        }
        const updateData = await this.barberRepo.findOne({ where: { id } });
        return successRes(updateData);
      } else {
        await this.barberRepo.update({ id }, updateBarberShopDto);
        const updateData = await this.barberRepo.findOne({ where: { id } });
        return successRes(updateData);
      }
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async remove(id: string) {
    try {
      const data = await this.barberRepo.findOne({ where: { id } });
      if (!data) {
        throw new NotFoundException('Not Fount Barber shop');
      }
      await this.barberRepo.delete(id);
      if (data.img) {
        if (await this.fileservis.existFile(data.img)) {
          await this.fileservis.deleteFile(data.img);
        }
      }
      return successRes({});
    } catch (error) {
      ErrorHender(error);
    }
  }

  async statusUpdate(id: string, newData: UpdateBarberShopStatus) {
    try {
      const data = await this.barberRepo.findOne({ where: { id } });
      if (!data) {
        throw new NotFoundException('Not found Barber_Shop ');
      }
      const updateData = await this.barberRepo.update(id, {
        status: newData.status,
      });
      return successRes(updateData);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async RefreshPassword(refreshPasswortDto: RefreshPasswortDto) {
    try {
      const data = await this.barberRepo.findOne({
        where: { email: refreshPasswortDto.email },
      });
      if (!data) {
        throw new NotFoundException('Not fount data');
      }
      if (data.role != BarberRole.BARBER_SHOP) {
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
        await this.barberRepo.update({ id: data.id }, { password: hashPass });
        return {
          message: "Parolingiz muvofiyaqatliy o'zgartirildi",
          statusCode: 201,
        };
      }
      let otp = await this.Otp.Generate(data.email);
      await this.Mail.sendMail(
        data.email,
        'Salom Sizning tasdiqlash kodingiz',
        `<div><h3>Ushbu kodni kichkimga bermayng uni faqat firibgarlar so'raydi Kod:<h1><b>${otp}</b></h1><h3></div>`,
      );

      return {
        message: `Akauntingizni tasdiqlash uchun quyidagi emailga ${data.email} xabar yuborildi.`,
      };
    } catch (error) {
      return ErrorHender(error);
    }
  }
}

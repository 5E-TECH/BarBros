import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
<<<<<<< HEAD
  UnprocessableEntityException,
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
import { UserService } from '../user/user.service';
import { OtpBarberDto } from './dto/Otp-barber.dto';
import { OtpGenerate } from 'src/infrostructure/otp_generet/otp_generate';
import { MailModule } from 'src/common/mail/mail.module';
import { MailService } from 'src/common/mail/mail.service';
import { FileService } from '../file/file.service';
import { ImageValidationPipe } from 'src/common/pipe/img-validation';
import { Request } from 'express';
import { BarberRole } from 'src/common/enum';
import { RefreshPasswortDto } from '../admin/dto/RefreshPassword.dto';
=======
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
>>>>>>> decbac9 (frony)

@Injectable()
export class BarberService {
  constructor(
    @InjectRepository(BarberEntity)
    private readonly BarberRepo: Repository<BarberEntity>,
    private readonly Bcrypt: BcryptEncryption,
<<<<<<< HEAD
    private readonly UserRepo: UserService,
    private readonly Otp: OtpGenerate,
    private readonly Mail: MailService,
    private readonly fileServis: FileService,
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
=======
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
>>>>>>> decbac9 (frony)
    } catch (error) {
      return ErrorHender(error);
    }
  }

<<<<<<< HEAD
  async login(loginBarberDto: LoginBarberDto) {
    try {
      const data = await this.BarberRepo.findOne({
        where: { email: loginBarberDto.email },
      });
      if (!data) {
        throw new ForbiddenException('Wrong email');
      }
      if(data.role != BarberRole.BARBER){
        throw new ForbiddenException("Forbidden")
      }
      if (!(await this.Bcrypt.Verify(loginBarberDto.password, data.password))) {
        throw new ForbiddenException('Wrong password');
      }
      let otp = await this.Otp.Generate(String(data.email));
      await this.Mail.sendMail(
        data.email,
        'Barbeshop dan salom',
        `<div><h3>Ushbu kodni hechkimga bermayng uni faqat firibgarlar so'raydi Kod:<h1><b>${otp}</b></h1><h3></div>`,
      );
      return {
        message: `Akauntingizni tasdiqlash uchun quyidagi emailga ${data.email} habar yuborildi.`,
      };
=======
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
>>>>>>> decbac9 (frony)
    } catch (error) {
      return ErrorHender(error);
    }
  }

<<<<<<< HEAD
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
      const role = BarberRole.BARBER
      const barberRepo = await this.BarberRepo.find()
      if(!barberRepo.length){
        throw new NotFoundException("Not faund data")
      }
      const [data, total] = await this.BarberRepo.findAndCount({
        where: {
          ...(full_name && { full_name: ILike(`%${full_name}%`) }),
          ...(phone_number && { phone_number: ILike(`%${phone_number}%`) }),
          ...(email && {email: ILike(`%${email}%`)}),
          ...(bio && {bio: ILike(`%${bio}%`)}),
          ...(role && {role: ILike(`%${role}%`)}),
        },
        relations:["reyting","service","barberShop","barberSchuld", "barberImage","booking"],
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
=======
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
>>>>>>> decbac9 (frony)
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
<<<<<<< HEAD
  async My_accaunt(req: Request){
    try {
      let user = req["user"]
      
      if(user.role != BarberRole.BARBER){
        throw new ForbiddenException("Forbidden")
      }
      const data = await this.BarberRepo.findOneBy({id:user.id})
      return successRes(data)
    } catch (error) {
      return ErrorHender(error)
    }
  }

  async findOne(id: string) {
    try {
      const data = await this.BarberRepo.findOne({
        where: { id },
        relations:["reyting","service","barberShop","barberSchuld", "barberImage","booking"],
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
        ]
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
=======

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
>>>>>>> decbac9 (frony)
    } catch (error) {
      return ErrorHender(error);
    }
  }

<<<<<<< HEAD
  async remove(id: string) {
    try {
      const data = await this.BarberRepo.findOneBy({ id });
      if (!data) {
        throw new NotFoundException('Not Fount barber');
      }
      let deleted = await this.BarberRepo.remove(data);
      return successRes(deleted);
=======
  // Barberni o'chirish
  async remove(id: string) {
    try {
      const barber = await this.BarberRepo.findOne({ where: { id } });
      if (!barber) throw new NotFoundException('Barber not found');

      await this.BarberRepo.remove(barber);
      return successRes(barber);
>>>>>>> decbac9 (frony)
    } catch (error) {
      return ErrorHender(error);
    }
  }

<<<<<<< HEAD
  async VarifyOtp(data: OtpBarberDto) {
    try {
      let Otp = await this.Otp.verify(String(data.email), data.otp);
      if (!Otp) {
        throw new UnprocessableEntityException('Wrong otp');
      }
      const Barber = await this.BarberRepo.findOne({
        where: { email: data.email },
      });
      if (!Barber) {
        throw new NotFoundException('Barber email not fount');
      }
      const acsesToken = this.UserRepo.AcsesToken({
        id: Barber.id,
        role: Barber.role,
      });
      const refreshToken = this.UserRepo.RefreshToken({
        id: Barber.id,
        role: Barber.role,
      });
      return { acsesToken, refreshToken };
=======
  // Parolni yangilash
  async refreshPassword(data: RefreshPasswordDto) {
    try {
      const barber = await this.BarberRepo.findOne({ where: { email: data.email } });
      if (!barber) throw new NotFoundException('Barber not found');

      if (!data.new_password) throw new BadRequestException('New password is required');

      const hashPass = await this.Bcrypt.Generate(data.new_password);
      await this.BarberRepo.update({ id: barber.id }, { password: hashPass });

      return { message: "Password updated successfully", statusCode: 201 };
>>>>>>> decbac9 (frony)
    } catch (error) {
      return ErrorHender(error);
    }
  }

<<<<<<< HEAD
   async RefreshPassword(refreshPasswortDto: RefreshPasswortDto){
      try {
        const data = await this.BarberRepo.findOne({where: {email: refreshPasswortDto.email}})
        if(!data){
          throw new NotFoundException("Not fount data")
        }
        if(data.role != BarberRole.BARBER){
          throw new ForbiddenException("Forbidden")
        }
        if(refreshPasswortDto.otp && refreshPasswortDto.new_password){
          let isOtp = await this.Otp.verify(refreshPasswortDto.email, refreshPasswortDto.otp)
          if(!isOtp){
            throw new BadRequestException("Wrong otp")
          }
          let hashPass = await this.Bcrypt.Generate(refreshPasswortDto.new_password)
          await this.BarberRepo.update({id: data.id},{password: hashPass})
          return {message: "Parolingiz muvofiyaqatliy o'zgartirildi",statusCode: 201}
  
        }
        let otp = await this.Otp.Generate(data.email)
        await this.Mail.sendMail(data.email, 'Salom Sizning tasdiqlash kodingiz',
          `<div><h3>Ushbu kodni kichkimga bermayng uni faqat firibgarlar so'raydi Kod:<h1><b>${otp}</b></h1><h3></div>`,);
  
          return {
            message: `Akauntingizni tasdiqlash uchun quyidagi emailga ${data.email} habar yuborildi.`,
          };
      } catch (error) {
        return ErrorHender(error)
      }
    }
=======
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
>>>>>>> decbac9 (frony)
}

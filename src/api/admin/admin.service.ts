import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  OnModuleInit,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import { UserEntity } from 'src/core/entity/user.entity';
import { UserService } from '../user/user.service';
import { UserRole } from 'src/common/enum';
import { RegisterUserDto } from '../user/dto/register-user.dto';
import { successRes } from 'src/infrostructure/utils/succesResponse';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { ErrorHender } from 'src/infrostructure/utils/catchError';
import { BcryptEncryption } from 'src/infrostructure/bcrypt';
import { OtpGenerate } from 'src/infrostructure/otp_generet/otp_generate';
import { MailService } from 'src/common/mail/mail.service';
import { OtpBarberDto } from '../barber/dto/Otp-barber.dto';
import { UpdateAdminDto } from './dto/updateAdmin.dto';
import { Request } from 'express';
import { RefreshPasswortDto } from './dto/RefreshPassword.dto';

@Injectable()
export class AdminService implements OnModuleInit {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly userService: UserService,
    private readonly Bcrypt: BcryptEncryption,
    private readonly Otp: OtpGenerate,
    private readonly Mail: MailService,
    private readonly user: UserService,
  ) {}

  async onModuleInit() {
    const full_name = process.env.SUPPER_ADMIN_FULL_NAME;
    const phone_number = process.env.SUPPER_ADMIN_PHONE_NUMBER;
    const email = String(process.env.SUPPER_ADMIN_EMAIL);
    const password = String(process.env.SUPPER_ADMIN_PASSWORD);

    try {
      let user = await this.userRepo.findOne({ where: { email: email } });
      if (!user) {
        let hashpass = await this.Bcrypt.Generate(password);

        const Supper_admin = this.userRepo.create({
          full_name,
          phone_number,
          email,
          password: hashpass,
          role: UserRole.SUPPER_ADMIN,
        });
        await this.userRepo.save(Supper_admin);
        console.log('Supper_admin creted');
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async register(registerUserDti: RegisterUserDto) {
    try {
      const data = await this.userRepo.findOne({
        where: { email: registerUserDti.email },
      });
      if (data) {
        throw new ConflictException('Email olredy exists');
      }
      const hashpass = await this.Bcrypt.Generate(registerUserDti.password);
      let admin = {
        ...registerUserDti,
        password: hashpass,
        role: UserRole.ADMIN,
      };
      const Admins = this.userRepo.create(admin);
      await this.userRepo.save(Admins);
      return successRes(Admins, 201);
    } catch (error) {
      return ErrorHender(error);
    }
  }
  async login(loginUserDto: LoginUserDto) {
    try {
      const user = await this.userRepo.findOne({
        where: { email: loginUserDto.email },
      });
      if (!user) {
        throw new ForbiddenException('Wrong email');
      }
      if(user.role != UserRole.ADMIN && user.role != UserRole.SUPPER_ADMIN){
          throw new ForbiddenException("Forfidden")
      }
      if (!(await this.Bcrypt.Verify(loginUserDto.password, user.password))) {
        throw new ForbiddenException('Wrong password');
      }
      let otp = await this.Otp.Generate(String(user.email));
      await this.Mail.sendMail(
        user.email,
        'Salom Sizning tasdiqlash kodingiz',
        `<div><h3>Ushbu kodni kichkimga bermayng uni faqat firibgarlar so'raydi Kod:<h1><b>${otp}</b></h1><h3></div>`,
      );
      return {
        message: `Akauntingizni tasdiqlash uchun quyidagi emailga ${user.email} habar yuborildi.`,
      };
    } catch (error) {
      return ErrorHender(error);
    }
  }
  async VarifyOtp(data: OtpBarberDto) {
    try {
      let Otp = await this.Otp.verify(String(data.email), data.otp);
      if (!Otp) {
        throw new UnprocessableEntityException('Wrong otp');
      }
      const Admin = await this.userRepo.findOne({
        where: { email: data.email },
      });
      if (!Admin) {
        throw new NotFoundException('Admin email not fount');
      }
      const acsesToken = this.user.AcsesToken({
        id: Admin.id,
        role: Admin.role,
      });
      const refreshToken = this.user.RefreshToken({
        id: Admin.id,
        role: Admin.role,
      });
      return { acsesToken, refreshToken };
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
        sortBy = 'full_name',
        order = 'DESC',
        page = 1,
        limit = 10,
      } = query;

      const skip = (Number(page) - 1) * Number(limit);
      const role = UserRole.SUPPER_ADMIN
      const rols = UserRole.ADMIN
      const userRepo = await this.userRepo.find()
      if(!userRepo.length){
        throw new NotFoundException("Not faund data")
      }
      const [data, total] = await this.userRepo.findAndCount({
        where: {
          ...(full_name && { full_name: ILike(`%${full_name}%`) }),
          ...(phone_number && { phone_number: ILike(`%${phone_number}%`) }),
          ...(email && {email: ILike(`%${email}%`)}),
          ...(role && {role: ILike(`%${role}%`)}),
          ...(rols && {role: ILike(`%${rols}%`)})
        },
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


  async findOne(id: string) {
    try {
      const data = await this.userRepo.findOne({
        where: { id, role: In([UserRole.ADMIN, UserRole.SUPPER_ADMIN]) },
      });
      if (!data) {
        throw new NotFoundException('Not fount admin');
      }
      return successRes(data);
    } catch (error) {
      return ErrorHender(error);
    }
  }
  async delete(id: string) {
    try {

      const data = await this.userRepo.findOne({ where: { id } });
      if (!data) {
        throw new NotFoundException('Admin not faunt');
      }
      if(data.role === UserRole.SUPPER_ADMIN){
        throw new ForbiddenException("supper admin o'z o'zini o'chira olmaydi")
      }
      const admin = await this.userRepo.remove(data);
      return successRes(admin);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async updateAdmin(
    id: string,
    data: UpdateAdminDto,
    req: Request
  ) {
    try {
      const admin = await this.userRepo.findOneBy({ id });
      if (!admin) {
        throw new NotFoundException('Admin topilmadi');
      }
  
      const currentUser = req["user"]
  
      if (currentUser.role === UserRole.SUPPER_ADMIN) {
        await this.userRepo.update(id, data);
        const updatedAdmin = await this.userRepo.findOneBy({ id });
        return successRes(updatedAdmin);
      }

      if (currentUser.role === UserRole.ADMIN) {
        if (currentUser.id !== id) {
          throw new ForbiddenException("Siz faqat o'z profilingizni o'zgartira olasiz");
        }
  
        await this.userRepo.update(id, data);
        const updatedAdmin = await this.userRepo.findOneBy({ id });
        return successRes(updatedAdmin);
      }
  
      throw new ForbiddenException(`Ruxsat yo'q`);
  
    } catch (error) {
      return ErrorHender(error);
    }
  }
  

  async my_accaunt(req: Request) {
    try {
      const data = await this.userRepo.findOne({
        where: { id: req['user'].id },
      });
      if (!data) {
        throw new NotFoundException('Not fount admin');
      }
      return successRes(data);
    } catch (error) {
      return ErrorHender(error);
    }
  }


  async RefreshPassword(data: RefreshPasswortDto){
    try {
      const admin = await this.userRepo.findOne({where: {email: data.email}})
      if(!admin){
        throw new NotFoundException("Not fount data")
      }
      if(admin.role != UserRole.ADMIN && admin.role != UserRole.SUPPER_ADMIN){
        throw new ForbiddenException("Forbidden")
      }
      if(data.otp && data.new_password){
        let isOtp = await this.Otp.verify(admin.email, data.otp)
        if(!isOtp){
          throw new BadRequestException("Wrong otp")
        }
        let hashPass = await this.Bcrypt.Generate(data.new_password)
        await this.userRepo.update({id: admin.id},{password: hashPass})
        return {message: "Parolingiz muvofiyaqatliy o'zgartirildi",statusCode: 201}

      }
      let otp = await this.Otp.Generate(admin.email)
      await this.Mail.sendMail(admin.email, 'Salom Sizning tasdiqlash kodingiz',
        `<div><h3>Ushbu kodni hechkimga bermang uni faqat firibgarlar so'raydi Kod:<h1><b>${otp}</b></h1><h3></div>`,);

      return {
          message: `Akauntingizni tasdiqlash uchun quyidagi emailga ${admin.email} habar yuborildi.`,
      };
    } catch (error) {
      return ErrorHender(error)
    }
  }
}

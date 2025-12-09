import {
<<<<<<< HEAD
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
=======
  Injectable,
  OnModuleInit,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { UserEntity } from 'src/core/entity/user.entity';
import { UserRole } from 'src/common/enum';
import { BcryptEncryption } from 'src/infrostructure/bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AdminLoginDto } from './dto/login -admin.dto';
import { UpdateAdminDto } from './dto/updateAdmin.dto';
import { RefreshPasswordDto } from './dto/RefreshPassword.dto';

import { successRes } from 'src/infrostructure/utils/succesResponse';
import { AccessToken, RefreshToken } from 'src/infrostructure/utils/Acses-Refresh-token';
import { ErrorHender } from 'src/infrostructure/utils/catchError';
import { Request } from 'express';
>>>>>>> decbac9 (frony)

@Injectable()
export class AdminService implements OnModuleInit {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
<<<<<<< HEAD
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
=======
    private readonly bcrypt: BcryptEncryption,
    private readonly jwtService: JwtService,
  ) {}

  // Supper adminni avtomatik yaratish
async onModuleInit() {
  const full_name = process.env.SUPPER_ADMIN_FULL_NAME;
  const phone_number = process.env.SUPPER_ADMIN_PHONE_NUMBER;
  const email = process.env.SUPPER_ADMIN_EMAIL;
  const password = process.env.SUPPER_ADMIN_PASSWORD;

  if (!email || !password) return console.log("Supper admin credentials not defined");

  try {
    let user = await this.userRepo.findOne({ where: { email } }); // email bo‘yicha qidiring
    if (!user) {
      const hashPass = await this.bcrypt.Generate(password);
      const supperAdmin = this.userRepo.create({
        full_name,
        phone_number,
        email,
        password: hashPass,
        role: UserRole.SUPPER_ADMIN,
      });
      await this.userRepo.save(supperAdmin);
      console.log('Supper admin created');
    }
  } catch (error) {
    console.log('Error creating supper admin:', error.message);
  }
}


async createAdmin(data: CreateAdminDto, req: Request) {
  try {
    const currentUser = req['user'];

    // Faqat SUPPER_ADMIN admin yaratishi mumkin
    if (currentUser.role !== UserRole.SUPPER_ADMIN) {
      throw new ForbiddenException("Only supper admin can create admin");
    }

    // Email borligini tekshirish
    const candidate = await this.userRepo.findOne({ where: { email: data.email } });
    if (candidate) {
      throw new BadRequestException("Admin with this email already exists");
    }

    // Passwordni hash qilish
    const hashPass = await this.bcrypt.Generate(data.password);

    // Admin yaratish
    const newAdmin = this.userRepo.create({
      full_name: data.full_name,
      email: data.email,
      phone_number: data.phone_number,
      password: hashPass,
      role: UserRole.ADMIN,
    });

    await this.userRepo.save(newAdmin);

    return successRes(newAdmin);
  } catch (error) {
    return ErrorHender(error);
  }
}



  // Login admin
async login(loginDto: AdminLoginDto) {
  try {
    const user = await this.userRepo.findOne({ where: { email: loginDto.email } }); // email bo‘yicha
    if (!user) throw new ForbiddenException('Wrong email or password');
    if (![UserRole.ADMIN, UserRole.SUPPER_ADMIN].includes(user.role)) throw new ForbiddenException('Forbidden');

    const isMatch = await this.bcrypt.Verify(loginDto.password, user.password);
    if (!isMatch) throw new ForbiddenException('Wrong email or password');

    const accessToken = AccessToken(this.jwtService, { id: user.id, role: user.role });
    const refreshToken = RefreshToken(this.jwtService, { id: user.id, role: user.role });

    return { accessToken, refreshToken };
  } catch (error) {
    return ErrorHender(error);
  }
}

  // Barcha adminlarni olish (supper admin uchun)
  async findAll(query: Record<string, any>) {
    try {
      const { full_name, phone_number, email, sortBy = 'full_name', order = 'DESC', page = 1, limit = 10 } = query;
      const skip = (Number(page) - 1) * Number(limit);

      const [data, total] = await this.userRepo.findAndCount({
        where: {
          role: In([UserRole.ADMIN, UserRole.SUPPER_ADMIN]),
          ...(full_name && { full_name: full_name }),
          ...(phone_number && { phone_number }),
          ...(email && { email }),
        },
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
=======
  async findOne(id: string) {
    const admin = await this.userRepo.findOne({ where: { id, role: In([UserRole.ADMIN, UserRole.SUPPER_ADMIN]) } });
    if (!admin) throw new NotFoundException('Admin not found');
    return successRes(admin);
  }

  async delete(id: string) {
    const admin = await this.userRepo.findOne({ where: { id } });
    if (!admin) throw new NotFoundException('Admin not found');
    if (admin.role === UserRole.SUPPER_ADMIN) throw new ForbiddenException("Supper admin cannot delete itself");
    await this.userRepo.remove(admin);
    return successRes(admin);
  }

  async updateAdmin(id: string, data: UpdateAdminDto, req: Request) {
    const admin = await this.userRepo.findOne({ where: { id } });
    if (!admin) throw new NotFoundException('Admin not found');

    const currentUser = req['user'];

    if (currentUser.role === UserRole.SUPPER_ADMIN || (currentUser.role === UserRole.ADMIN && currentUser.id === id)) {
      if (data.password) data.password = await this.bcrypt.Generate(data.password);
      await this.userRepo.update(id, data);
      const updatedAdmin = await this.userRepo.findOne({ where: { id } });
      return successRes(updatedAdmin);
    }

    throw new ForbiddenException("You cannot update this admin");
  }

  async my_accaunt(req: Request) {
    const admin = await this.userRepo.findOne({ where: { id: req['user'].id } });
    if (!admin) throw new NotFoundException('Admin not found');
    return successRes(admin);
  }

async refreshPassword(data: RefreshPasswordDto) {
  const admin = await this.userRepo.findOne({ where: { email: data.email } }); // email bo‘yicha
  if (!admin) throw new NotFoundException('Admin not found');
  if (![UserRole.ADMIN, UserRole.SUPPER_ADMIN].includes(admin.role)) throw new ForbiddenException('Forbidden');

  if (!data.new_password) throw new BadRequestException('New password is required');

  const hashPass = await this.bcrypt.Generate(data.new_password);
  await this.userRepo.update({ id: admin.id }, { password: hashPass });
  return { message: "Password updated successfully", statusCode: 201 };
}
>>>>>>> decbac9 (frony)
}

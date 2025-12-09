import {
  BadRequestException,
<<<<<<< HEAD
  ConflictException,
=======
>>>>>>> decbac9 (frony)
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/core/entity/user.entity';
import { ILike, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './dto/update-user.dto';
import { ErrorHender } from 'src/infrostructure/utils/catchError';
import { successRes } from 'src/infrostructure/utils/succesResponse';
import { BcryptEncryption } from 'src/infrostructure/bcrypt';
<<<<<<< HEAD
import { RegisterUserDto } from './dto/register-user.dto';
import { UserRole } from 'src/common/enum';
import { OtpGenerate } from 'src/infrostructure/otp_generet/otp_generate';
import { MailService } from 'src/common/mail/mail.service';
import { Request } from 'express';
import { RefreshPasswortDto } from '../admin/dto/RefreshPassword.dto';
=======
import { UserRole } from 'src/common/enum';
import { Request } from 'express';
import { RefreshPasswordDto } from '../admin/dto/RefreshPassword.dto';
import { JWTPayload } from 'src/infrostructure/utils/user.type';
import {
  AccessToken,
  RefreshToken,
} from '../../infrostructure/utils/Acses-Refresh-token';
>>>>>>> decbac9 (frony)

@Injectable()
export class UserService {
  constructor(
<<<<<<< HEAD
    @InjectRepository(UserEntity) private readonly User: Repository<UserEntity>,
    private readonly jwtSerwis: JwtService,
    private readonly Bcrypt: BcryptEncryption,
    private readonly Otp: OtpGenerate,
    private readonly Mail: MailService,
  ) {}

  async register(registerUserDti: RegisterUserDto) {
    try {
      const data = await this.User.findOne({
        where: { email: registerUserDti.email },
      });
      if (data) {
        throw new ConflictException('Email olredy exists');
      }
      const hashPass = await this.Bcrypt.Generate(registerUserDti.password);

      let user = {
        ...registerUserDti,
        password: hashPass,
      };
      const user2 = this.User.create(user);
      await this.User.save(user2);
      return successRes(user2, 201);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    try {
      const data = await this.User.findOne({
        where: { email: loginUserDto.email },
      });
      if (!data) {
        throw new ForbiddenException('Wrong email');
      }
      if (data.role != UserRole.USER && data.role != UserRole.SUPPER_ADMIN) {
        throw new ForbiddenException('Forbidden');
      }
      if (!(await this.Bcrypt.Verify(loginUserDto.password, data.password))) {
        throw new ForbiddenException('Wrong password');
      }
      const acsesToken = this.AcsesToken({ 
        id: data.id, 
        role: data.role 
      });
      const refreshToken = this.RefreshToken({
        id: data.id,
        role: data.role,
      });
      return { acsesToken, refreshToken };
=======
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly bcrypt: BcryptEncryption,
  ) {}


   async register(phone_number: string) {
    let user = await this.userRepo.findOne({ where: { phone_number } });

    // Yangi user bo‘lsa, yaratiladi
    if (!user) {
      user = this.userRepo.create({
        phone_number,
        code: '0000', // hozircha default code
        role: UserRole.USER,
      });
      await this.userRepo.save(user);
    }

    // OTP yuborish (hozircha 0000)
    return {
      message: 'Code sent to your phone (hozircha 0000)',
      user_id: user.id,
    };
  }

  async verifyCode(phone_number: string, code: string) {
    const user = await this.userRepo.findOne({ where: { phone_number } });
    if (!user) throw new ForbiddenException('User not found');

    if (code !== user.code) throw new ForbiddenException('Wrong code');

    const accessToken = this.jwtService.sign({
      id: user.id,
      role: user.role,
    });

    return { accessToken, user_id: user.id, message: 'Code verified' };
  }

  async setFullName(user_id: string, full_name: string) {
    const user = await this.userRepo.findOne({ where: { id: user_id } });
    if (!user) throw new NotFoundException('User not found');

    user.full_name = full_name;
    await this.userRepo.save(user);

    return { message: 'Full name set successfully', user_id: user.id };
  }



  async login(loginUserDto: LoginUserDto) {
    try {
      const user = await this.userRepo.findOne({
        where: { phone_number: loginUserDto.phone_number },
      });

      if (!user) {
        throw new ForbiddenException('Phone number not found');
      }

      if (loginUserDto.code !== user.code) {
        throw new ForbiddenException('Wrong code');
      }

      if (user.role !== UserRole.USER && user.role !== UserRole.SUPPER_ADMIN) {
        throw new ForbiddenException('Forbidden');
      }

      const accessToken = AccessToken(this.jwtService, {
        id: user.id,
        role: user.role,
      });

      const refreshToken = RefreshToken(this.jwtService, {
        id: user.id,
        role: user.role,
      });

      return { accessToken, refreshToken };
>>>>>>> decbac9 (frony)
    } catch (error) {
      return ErrorHender(error);
    }
  }

<<<<<<< HEAD
async findAll(query: Record<string, any>) {
=======
  async findAll(query: Record<string, any>) {
>>>>>>> decbac9 (frony)
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
<<<<<<< HEAD
      const role = UserRole.USER
      const userRepo = await this.User.find()
      if(!userRepo.length){
        throw new NotFoundException("Not faund data")
      }
      const [data, total] = await this.User.findAndCount({
        where: {
          ...(full_name && { full_name: ILike(`%${full_name}%`) }),
          ...(phone_number && { phone_number: ILike(`%${phone_number}%`) }),
          ...(email && {email: ILike(`%${email}%`)}),
          ...(role && {role: ILike(`%${role}%`)}),
        },
        relations:["booking","notifikation", "reyting"],
        select: ['full_name', 'email', 'phone_number', 'role', 'id'],
=======
      const role = UserRole.USER;
      const userRepo = await this.userRepo.find();
      if (!userRepo.length) {
        throw new NotFoundException('Not faund data');
      }
      const [data, total] = await this.userRepo.findAndCount({
        where: {
          ...(full_name && { full_name: ILike(`%${full_name}%`) }),
          ...(phone_number && { phone_number: ILike(`%${phone_number}%`) }),
          ...(email && { email: ILike(`%${email}%`) }),
          ...(role && { role: ILike(`%${role}%`) }),
        },
        relations: ['booking', 'notifikation', 'reyting'],
        select: ['full_name',  'phone_number', 'role', 'id'],
>>>>>>> decbac9 (frony)
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

      if (user.role != UserRole.USER) {
        throw new ForbiddenException('Forbidden');
      }
<<<<<<< HEAD
      const data = await this.User.findOne({where:{id:user.id},relations:["booking","notifikation", "reyting"] });
=======
      const data = await this.userRepo.findOne({
        where: { id: user.id },
        relations: ['booking', 'notifikation', 'reyting'],
      });
>>>>>>> decbac9 (frony)
      return successRes(data);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async findOne(id: string) {
    try {
<<<<<<< HEAD
      const data = await this.User.findOne({
        where: { id, role: UserRole.USER },
        relations:["booking","notifikation", "reyting"],
        select: ['full_name', 'email', 'phone_number', 'role', 'id'],
=======
      const data = await this.userRepo.findOne({
        where: { id, role: UserRole.USER },
        relations: ['booking', 'notifikation', 'reyting'],
        select: ['full_name', 'phone_number', 'role', 'id'],
>>>>>>> decbac9 (frony)
      });
      if (!data) {
        throw new NotFoundException('Not fount user');
      }
      return successRes(data);
    } catch (error) {
      return ErrorHender(error);
    }
  }
  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
<<<<<<< HEAD
      const data = await this.User.findOne({ where: { id } });
      if (!data) {
        throw new NotFoundException('Not fount user by id');
      }
      await this.User.update(id, updateUserDto);
      const newdata = await this.User.findOne({
        where: { id },
        select: ['full_name', 'email', 'phone_number', 'role', 'id'],
=======
      const data = await this.userRepo.findOne({ where: { id } });
      if (!data) {
        throw new NotFoundException('Not fount user by id');
      }
      await this.userRepo.update(id, updateUserDto);
      const newdata = await this.userRepo.findOne({
        where: { id },
        select: ['full_name', 'phone_number', 'role', 'id'],
>>>>>>> decbac9 (frony)
      });
      return successRes(newdata);
    } catch (error) {
      return ErrorHender(error);
    }
  }

<<<<<<< HEAD
  async RefreshPassword(refreshPasswortDto: RefreshPasswortDto) {
    try {
      const data = await this.User.findOne({
        where: { email: refreshPasswortDto.email },
      });
      if (!data) {
        throw new NotFoundException('Not fount data');
      }
      if (data.role != UserRole.USER) {
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
        await this.User.update({ id: data.id }, { password: hashPass });
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
        message: `Akauntingizni tasdiqlash uchun quyidagi emailga ${data.email} habar yuborildi.`,
      };
=======
  async profile(user: JWTPayload): Promise<object> {
    try {
      const { id } = user;
      const myProlile = await this.userRepo.findOne({
        where: { id },
      });

      return successRes(myProlile);
>>>>>>> decbac9 (frony)
    } catch (error) {
      return ErrorHender(error);
    }
  }

<<<<<<< HEAD
  async delet(id: string) {
    try {
      let data = await this.User.findOneBy({ id });
      if (!data) {
        throw new NotFoundException('Not fount user');
      }
      let delet = await this.User.remove(data);
=======


  async delet(id: string) {
    try {
      let data = await this.userRepo.findOneBy({ id });
      if (!data) {
        throw new NotFoundException('Not fount user');
      }
      let delet = await this.userRepo.remove(data);
>>>>>>> decbac9 (frony)
      return successRes(delet);
    } catch (error) {
      return ErrorHender(error);
    }
  }
<<<<<<< HEAD

  AcsesToken(pelod: { id: string; role: string }) {
    return this.jwtSerwis.sign(pelod, {
      secret: String(process.env.ACSES_SECRET),
      expiresIn: '30d',
    });
  }
  RefreshToken(pelod: { id: string; role: string }) {
    return this.jwtSerwis.sign(pelod, {
      secret: String(process.env.REFRESG_SEKRET),
      expiresIn: '60d',
    });
  }
=======
>>>>>>> decbac9 (frony)
}

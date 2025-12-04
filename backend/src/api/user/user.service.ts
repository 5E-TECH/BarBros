import {
  BadRequestException,
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
import { UserRole } from 'src/common/enum';
import { Request } from 'express';
import { RefreshPasswortDto } from '../admin/dto/RefreshPassword.dto';
import { JWTPayload } from 'src/infrostructure/utils/user.type';
import {
  AccessToken,
  RefreshToken,
} from '../../infrostructure/utils/Acses-Refresh-token';

@Injectable()
export class UserService {
  constructor(
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
      const data = await this.userRepo.findOne({
        where: { id: user.id },
        relations: ['booking', 'notifikation', 'reyting'],
      });
      return successRes(data);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async findOne(id: string) {
    try {
      const data = await this.userRepo.findOne({
        where: { id, role: UserRole.USER },
        relations: ['booking', 'notifikation', 'reyting'],
        select: ['full_name', 'phone_number', 'role', 'id'],
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
      const data = await this.userRepo.findOne({ where: { id } });
      if (!data) {
        throw new NotFoundException('Not fount user by id');
      }
      await this.userRepo.update(id, updateUserDto);
      const newdata = await this.userRepo.findOne({
        where: { id },
        select: ['full_name', 'phone_number', 'role', 'id'],
      });
      return successRes(newdata);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async profile(user: JWTPayload): Promise<object> {
    try {
      const { id } = user;
      const myProlile = await this.userRepo.findOne({
        where: { id },
      });

      return successRes(myProlile);
    } catch (error) {
      return ErrorHender(error);
    }
  }



  async delet(id: string) {
    try {
      let data = await this.userRepo.findOneBy({ id });
      if (!data) {
        throw new NotFoundException('Not fount user');
      }
      let delet = await this.userRepo.remove(data);
      return successRes(delet);
    } catch (error) {
      return ErrorHender(error);
    }
  }
}

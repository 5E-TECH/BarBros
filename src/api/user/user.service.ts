import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
  ) {}


async register(phone_number: string) {
  try {
    let user = await this.userRepo.findOne({ where: { phone_number } });

    const code = '0000'; // Hozircha test

    
    if (!user) {
      user = this.userRepo.create({
        phone_number,
        code,
        role: UserRole.USER,
        // is_completed: false,
      });

      await this.userRepo.save(user);


      return {
        is_new: true,
        message: 'New user created, code sent',
        user_id: user.id,
      };
    }

    // Eski user bo‘lsa — code yangilanadi
    user.code = code;
    await this.userRepo.save(user);

    return {
      is_new: false,
      message: 'Existing user code sent',
      user_id: user.id,
    };

  } catch (error) {
    return ErrorHender(error);
  }
}


async verifyCode(phone_number: string, code: string) {
  try {
    const user = await this.userRepo.findOne({ where: { phone_number } });
    if (!user) throw new ForbiddenException('User not found');
    if (code !== user.code) throw new ForbiddenException('Wrong code');

    // Yangi user hali full_name kiritmagan → token bermaymiz
    // if (!user.is_completed) {
    //   return {
    //     step: 'set_full_name',
    //     message: 'Please set your full name',
    //     user_id: user.id,
    //   };
    // }



    // Eski user → to‘liq ro‘yxatdan o‘tgan → token beramiz
    const accessToken = AccessToken(this.jwtService, { id: user.id, role: user.role });
    const refreshToken = RefreshToken(this.jwtService, { id: user.id, role: user.role });

    return { accessToken, refreshToken };
  } catch (error) {
    return ErrorHender(error);
  }
}


async setFullName(user_id: number, full_name: string) {
  try {
    const user = await this.userRepo.findOne({ where: { id: user_id } });
    if (!user) throw new NotFoundException('User not found');

    user.full_name = full_name;
    // user.is_completed = true; // Endi to‘liq ro‘yxatdan o‘tdi
    await this.userRepo.save(user);

    const accessToken = AccessToken(this.jwtService, { id: user.id, role: user.role });
    const refreshToken = RefreshToken(this.jwtService, { id: user.id, role: user.role });

    return {
      message: 'Full name set successfully',
      accessToken,
      refreshToken,
    };
  } catch (error) {
    return ErrorHender(error);
  }
}


  async findAll(query: Record<string, any>) {
    try {
      const {
        phone_number,
        full_name,
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

  async findOne(id:  number) {
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
  async update(id: number, updateUserDto: UpdateUserDto) {
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

  async delet(id: number) {
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

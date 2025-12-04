import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import { UserEntity } from 'src/core/entity/user.entity';
import { UserRole } from 'src/common/enum';
import { successRes } from 'src/infrostructure/utils/succesResponse';
import { LoginAdminDto } from './dto/login -admin.dto';
import { ErrorHender } from 'src/infrostructure/utils/catchError';
import { BcryptEncryption } from 'src/infrostructure/bcrypt';
import { UpdateAdminDto } from './dto/updateAdmin.dto';
import { Request } from 'express';
import { RefreshPasswortDto } from './dto/RefreshPassword.dto';
import { JwtService } from '@nestjs/jwt';
import {AccessToken,RefreshToken} from '../../infrostructure/utils/Acses-Refresh-token'

@Injectable()
export class AdminService implements OnModuleInit {
constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly Bcrypt: BcryptEncryption,
    private readonly jwtService: JwtService,
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
        successRes('supper admin created')
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async login(loginUserDto: LoginAdminDto) {
    try {
      const user = await this.userRepo.findOne({
        where: { login: loginUserDto.login },
      });

      if (!user) {
        throw new ForbiddenException('Wrong email');
      }

      // Faqat adminlar kira oladi
      if (user.role !== UserRole.ADMIN && user.role !== UserRole.SUPPER_ADMIN) {
        throw new ForbiddenException('Forbidden');
      }

      // Parolni tekshirish
      const isMatch = await this.Bcrypt.Verify(
        loginUserDto.password,
        user.password,
      );

      if (!isMatch) {
        throw new ForbiddenException('Wrong password');
      }

      // Tokenlar
      const accessToken = AccessToken(this.jwtService,{
        id: user.id,
        role: user.role,
      });

      const refreshToken = RefreshToken(this.jwtService,{
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
      const role = UserRole.SUPPER_ADMIN;
      const rols = UserRole.ADMIN;
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
          ...(rols && { role: ILike(`%${rols}%`) }),
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
      if (data.role === UserRole.SUPPER_ADMIN) {
        throw new ForbiddenException("supper admin o'z o'zini o'chira olmaydi");
      }
      const admin = await this.userRepo.remove(data);
      return successRes(admin);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async updateAdmin(id: string, data: UpdateAdminDto, req: Request) {
    try {
      const admin = await this.userRepo.findOneBy({ id });
      if (!admin) {
        throw new NotFoundException('Admin topilmadi');
      }

      const currentUser = req['user'];

      if (currentUser.role === UserRole.SUPPER_ADMIN) {
        await this.userRepo.update(id, data);
        const updatedAdmin = await this.userRepo.findOneBy({ id });
        return successRes(updatedAdmin);
      }

      if (currentUser.role === UserRole.ADMIN) {
        if (currentUser.id !== id) {
          throw new ForbiddenException(
            "Siz faqat o'z profilingizni o'zgartira olasiz",
          );
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

  async RefreshPassword(data: RefreshPasswortDto) {
    try {
      const admin = await this.userRepo.findOne({ where: { email: data.email } });
      if (!admin) {
        throw new NotFoundException('Not fount data');
      }
      if (admin.role != UserRole.ADMIN && admin.role != UserRole.SUPPER_ADMIN) {
        throw new ForbiddenException('Forbidden');
      }
     
      if (!data.new_password) {
        throw new BadRequestException('New password is required');
      }

      let hashPass = await this.Bcrypt.Generate(data.new_password);
      await this.userRepo.update({ id: admin.id }, { password: hashPass });
      return {
        message: "Parolingiz muvofiyaqatliy o'zgartirildi",
        statusCode: 201,
      };
    } catch (error) {
      return ErrorHender(error);
    }
  }
}
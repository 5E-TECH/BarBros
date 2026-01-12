import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/modules/user/entities/user.admin,entity';
import { ILike, In, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './dto/update-user.dto';
import { ErrorHender } from 'src/utils/catchError';
import { successRes } from 'src/utils/succesResponse';
import { UserRole } from 'src/common/enum';
import { Request } from 'express';
import { JWTPayload } from 'src/utils/user.type';
import { AccessToken, RefreshToken } from '../../utils/Acses-Refresh-token';
import { BcryptEncryption } from 'src/infrostructure/bcrypt';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AdminLoginDto } from './dto/login -admin.dto';
import { UpdateAdminDto } from './dto/updateAdmin.dto';
import {
  RefreshAdminPasswordDto,
} from './dto/Refresh-Admin-Password.dto';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly bcrypt: BcryptEncryption,
  ) {}

  async onModuleInit() {
    const full_name = process.env.SUPPER_ADMIN_FULL_NAME;
    const phone_number = process.env.SUPPER_ADMIN_PHONE_NUMBER;
    const username = process.env.SUPPER_ADMIN_EMAIL;
    const password = process.env.SUPPER_ADMIN_PASSWORD;

    if (!username || !password)
      return console.log('Supper admin credentials not defined');

    try {
      let user = await this.userRepo.findOne({ where: { username } });
      if (!user) {
        const hashPass = await this.bcrypt.Generate(password);
        const supperAdmin = this.userRepo.create({
          full_name,
          phone_number,
          username,
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

      if (currentUser.role !== UserRole.SUPPER_ADMIN) {
        throw new ForbiddenException('Only supper admin can create admin');
      }

      const exists = await this.userRepo.findOne({
        where: [
          { username: data.username },
          { phone_number: data.phone_number },
        ],
      });

      if (exists) {
        throw new BadRequestException(
          'UserName yoki telefon raqam allaqachon mavjud',
        );
      }

      const hashPass = await this.bcrypt.Generate(data.password);

      const newAdmin = this.userRepo.create({
        full_name: data.full_name,
        username: data.username,
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

  async loginAdmin(loginDto: AdminLoginDto) {
    try {
      const user = await this.userRepo.findOne({
        where: { username: loginDto.email },
      });
      if (!user) throw new ForbiddenException('Wrong email or password');
      if (UserRole.USER === user.role)
        throw new ForbiddenException(
          'Bu roldagi foydalanuvchiga parol bilan kirish mummkin emas...!!!',
        );

      const userPass = user.password || '';
      const isMatch = await this.bcrypt.Verify(loginDto.password, userPass);
      if (!isMatch) throw new ForbiddenException('Wrong email or password');

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

  async findAllAdmin(query: Record<string, any>) {
    try {
      const {
        full_name,
        phone_number,
        email,
        sortBy = 'full_name',
        order = 'DESC',
        page = 1,
        limit = 10,
      } = query;
      const skip = (Number(page) - 1) * Number(limit);

      const [data, total] = await this.userRepo.findAndCount({
        where: {
          role: In([UserRole.ADMIN, UserRole.SUPPER_ADMIN]),
          ...(full_name && { full_name: full_name }),
          ...(phone_number && { phone_number }),
          ...(email && { email }),
        },
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

  async findOneAdmin(id: number) {
    const admin = await this.userRepo.findOne({
      where: { id, role: In([UserRole.ADMIN, UserRole.SUPPER_ADMIN]) },
    });
    if (!admin) throw new NotFoundException('Admin not found');
    return successRes(admin);
  }

  async deleteAdmin(id: number) {
    const admin = await this.userRepo.findOne({ where: { id } });
    if (!admin) throw new NotFoundException('Admin not found');
    if (admin.role === UserRole.SUPPER_ADMIN)
      throw new ForbiddenException('Supper admin cannot delete itself');
    await this.userRepo.remove(admin);
    return successRes(admin);
  }

  async updateAdmin(id: number, data: UpdateAdminDto, req: Request) {
    const admin = await this.userRepo.findOne({ where: { id } });
    if (!admin) throw new NotFoundException('Admin not found');

    const currentUser = req['user'];

    if (
      currentUser.role === UserRole.SUPPER_ADMIN ||
      (currentUser.role === UserRole.ADMIN && currentUser.id === id)
    ) {
      if (data.password)
        data.password = await this.bcrypt.Generate(data.password);
      await this.userRepo.update(id, data);
      const updatedAdmin = await this.userRepo.findOne({ where: { id } });
      return successRes(updatedAdmin);
    }

    throw new ForbiddenException('You cannot update this admin');
  }

  async MyAcauntAdmin(req: Request) {
    const admin = await this.userRepo.findOne({
      where: { id: req['user'].id },
    });
    if (!admin) throw new NotFoundException('Admin not found');
    return successRes(admin);
  }

  async refreshPasswordAdmin(data: RefreshAdminPasswordDto) {
    const admin = await this.userRepo.findOne({
      where: { username: data.email },
    });
    if (!admin) throw new NotFoundException('Admin not found');
    if (![UserRole.ADMIN, UserRole.SUPPER_ADMIN].includes(admin.role))
      throw new ForbiddenException('Forbidden');

    if (!data.new_password)
      throw new BadRequestException('New password is required');

    const hashPass = await this.bcrypt.Generate(data.new_password);
    await this.userRepo.update({ id: admin.id }, { password: hashPass });
    return { message: 'Password updated successfully', statusCode: 201 };
  }

  /////////////// -----    USER-----------//////////////////////////

  async register(phone_number: string) {
    try {
      let user = await this.userRepo.findOne({ where: { phone_number } });

      const code = '0000';

      if (!user) {
        user = this.userRepo.create({
          phone_number,
          otp:code,
          role: UserRole.USER,
        });

        await this.userRepo.save(user);

        return {
          is_new: true,
          message: 'New user created, code sent',
          user_id: user.id,
        };
      }

      user.otp = code;
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
      if (code !== user.otp) throw new ForbiddenException('Wrong code');



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

  async setFullName(user_id: number, full_name: string) {
    try {
      const user = await this.userRepo.findOne({ where: { id: user_id } });
      if (!user) throw new NotFoundException('User not found');

      user.full_name = full_name;
      // user.is_completed = true; // Endi to‘liq ro‘yxatdan o‘tdi
      await this.userRepo.save(user);

      const accessToken = AccessToken(this.jwtService, {
        id: user.id,
        role: user.role,
      });
      const refreshToken = RefreshToken(this.jwtService, {
        id: user.id,
        role: user.role,
      });

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
        select: [
          'full_name',
          'phone_number',
          'role',
          'id',
          'created_at',
          'created_by',
          'modified_at',
          'is_deleted',
          'modified_by',
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

  async findOne(id: number) {
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

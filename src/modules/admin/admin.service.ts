import {
  Injectable,
  OnModuleInit,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { UserRole } from 'src/common/enum';
import { BcryptEncryption } from 'src/infrostructure/bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AdminLoginDto } from './dto/login -admin.dto';
import { UpdateAdminDto } from './dto/updateAdmin.dto';
import { RefreshPasswordDto } from './dto/RefreshPassword.dto';

import { successRes } from 'src/utils/succesResponse';
import { AccessToken, RefreshToken } from 'src/utils/Acses-Refresh-token';
import { ErrorHender } from 'src/utils/catchError';
import { Request } from 'express';
import { UserEntity } from 'src/modules/user/entities/user.admin,entity';

@Injectable()
export class AdminService implements OnModuleInit {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly bcrypt: BcryptEncryption,
    private readonly jwtService: JwtService,
  ) {}

async onModuleInit() {
  const full_name = process.env.SUPPER_ADMIN_FULL_NAME;
  const phone_number = process.env.SUPPER_ADMIN_PHONE_NUMBER;
  const email = process.env.SUPPER_ADMIN_EMAIL;
  const password = process.env.SUPPER_ADMIN_PASSWORD;

  if (!email || !password) return console.log("Supper admin credentials not defined");

  try {
    let user = await this.userRepo.findOne({ where: { email } });
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

    if (currentUser.role !== UserRole.SUPPER_ADMIN) {
      throw new ForbiddenException("Only supper admin can create admin");
    }

    const exists = await this.userRepo.findOne({
      where: [
        { email: data.email },
        { phone_number: data.phone_number },
      ],
    });

    if (exists) {
      throw new BadRequestException("Email yoki telefon raqam allaqachon mavjud");
    }

    const hashPass = await this.bcrypt.Generate(data.password);

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


async login(loginDto: AdminLoginDto) {
  try {
    const user = await this.userRepo.findOne({ where: { email: loginDto.email } });
    if (!user) throw new ForbiddenException('Wrong email or password');
    if (UserRole.USER === user.role) throw new ForbiddenException('Bu roldagi foydalanuvchiga parol bilan kirish mummkin emas...!!!');


    const userPass = user.password || "";
    const isMatch = await this.bcrypt.Verify(loginDto.password, userPass);
    if (!isMatch) throw new ForbiddenException('Wrong email or password');

    const accessToken = AccessToken(this.jwtService, { id: user.id, role: user.role });
    const refreshToken = RefreshToken(this.jwtService, { id: user.id, role: user.role });

    return { accessToken, refreshToken };
  } catch (error) {
    return ErrorHender(error);
  }
}

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

  async findOne(id: number) {
    const admin = await this.userRepo.findOne({ where: { id, role: In([UserRole.ADMIN, UserRole.SUPPER_ADMIN]) } });
    if (!admin) throw new NotFoundException('Admin not found');
    return successRes(admin);
  }

  async delete(id: number) {
    const admin = await this.userRepo.findOne({ where: { id } });
    if (!admin) throw new NotFoundException('Admin not found');
    if (admin.role === UserRole.SUPPER_ADMIN) throw new ForbiddenException("Supper admin cannot delete itself");
    await this.userRepo.remove(admin);
    return successRes(admin);
  }

  async updateAdmin(id: number, data: UpdateAdminDto, req: Request) {
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
}

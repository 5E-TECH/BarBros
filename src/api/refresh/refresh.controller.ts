import {
  Body,
  Controller,
  ForbiddenException,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
<<<<<<< HEAD
import { ErrorHender } from 'src/infrostructure/utils/catchError';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDro } from './refreshToken.Dto';
import { ApiTags } from '@nestjs/swagger';
import { BarberShopService } from '../barber-shop/barber-shop.service';
=======
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDro } from './refreshToken.Dto';
import { ApiTags } from '@nestjs/swagger';
>>>>>>> decbac9 (frony)
import { BarberRole } from 'src/common/enum';
import { InjectRepository } from '@nestjs/typeorm';
import { BarberShopEntity } from 'src/core/entity/barber-shop.entity';
import { Repository } from 'typeorm';
<<<<<<< HEAD
=======
import { UserEntity } from 'src/core/entity/user.entity';
import { AccessToken } from 'src/infrostructure/utils/Acses-Refresh-token';
>>>>>>> decbac9 (frony)

@ApiTags('RefreshToken')
@Controller('refresh')
export class RefreshController {
  constructor(
    @InjectRepository(BarberShopEntity)
    private readonly barberShop: Repository<BarberShopEntity>,
<<<<<<< HEAD
    private readonly UserRepo: UserService,
    private readonly Jwt: JwtService,
  ) {}

  @Post('refreshToken')
  async refrechToken(@Body() tokens: RefreshTokenDro) {
=======
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('refreshToken')
  async refreshToken(@Body() tokens: RefreshTokenDro) {
>>>>>>> decbac9 (frony)
    const [bearer, token] = tokens.token.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization format');
    }
<<<<<<< HEAD
    try {
      const data = this.Jwt.verify(token, {
        secret: String(process.env.REFRESG_SEKRET),
      });
=======

    try {
      const data = this.jwtService.verify(token, {
        secret: String(process.env.REFRESH_SECRET),
      });

      // BarberShop uchun
>>>>>>> decbac9 (frony)
      if (data.role === BarberRole.BARBER_SHOP) {
        const barberShop = await this.barberShop.findOne({
          where: { id: data.id },
        });
<<<<<<< HEAD
        if (barberShop && barberShop.status === false) {
          throw new ForbiddenException('Siz Admin tomonidan bloklangansiz');
        }
        if (barberShop) {
          const acsesToken = this.UserRepo.AcsesToken({
            id: barberShop.id,
            role: barberShop.role,
          });
          return { acsesToken };
        }
      } else {
        const acsesToken = this.UserRepo.AcsesToken({
          id: data.id,
          role: data.role,
        });
        return { acsesToken };
      }
    } catch (error) {
      return ErrorHender(error);
=======

        if (!barberShop) {
          throw new UnauthorizedException('User not found');
        }

        if (barberShop.status === false) {
          throw new ForbiddenException('Siz Admin tomonidan bloklangansiz');
        }

        const accessToken = AccessToken(this.jwtService, {
          id: barberShop.id,
          role: barberShop.role,
        });

        return { accessToken };
      }

      // Oddiy user uchun
      const accessToken = AccessToken(this.jwtService, {
        id: data.id,
        role: data.role,
      });

      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
>>>>>>> decbac9 (frony)
    }
  }
}

import {
  Body,
  Controller,
  ForbiddenException,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDro } from './refreshToken.Dto';
import { ApiTags } from '@nestjs/swagger';
import { BarberRole } from 'src/common/enum';
import { InjectRepository } from '@nestjs/typeorm';
import { BarberShopEntity } from 'src/core/entity/barber-shop.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/core/entity/user.entity';
import { AccessToken } from 'src/infrostructure/utils/Acses-Refresh-token';

@ApiTags('RefreshToken')
@Controller('refresh')
export class RefreshController {
  constructor(
    @InjectRepository(BarberShopEntity)
    private readonly barberShop: Repository<BarberShopEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('refreshToken')
  async refreshToken(@Body() tokens: RefreshTokenDro) {
    const [bearer, token] = tokens.token.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization format');
    }

    try {
      const data = this.jwtService.verify(token, {
        secret: String(process.env.REFRESH_SECRET),
      });

      // BarberShop uchun
      if (data.role === BarberRole.BARBER_SHOP) {
        const barberShop = await this.barberShop.findOne({
          where: { id: data.id },
        });

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
    }
  }
}

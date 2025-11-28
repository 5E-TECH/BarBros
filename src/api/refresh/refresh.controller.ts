import {
  Body,
  Controller,
  ForbiddenException,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ErrorHender } from 'src/infrostructure/utils/catchError';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDro } from './refreshToken.Dto';
import { ApiTags } from '@nestjs/swagger';
import { BarberShopService } from '../barber-shop/barber-shop.service';
import { BarberRole } from 'src/common/enum';
import { InjectRepository } from '@nestjs/typeorm';
import { BarberShopEntity } from 'src/core/entity/barber-shop.entity';
import { Repository } from 'typeorm';

@ApiTags('RefreshToken')
@Controller('refresh')
export class RefreshController {
  constructor(
    @InjectRepository(BarberShopEntity)
    private readonly barberShop: Repository<BarberShopEntity>,
    private readonly UserRepo: UserService,
    private readonly Jwt: JwtService,
  ) {}

  @Post('refreshToken')
  async refrechToken(@Body() tokens: RefreshTokenDro) {
    const [bearer, token] = tokens.token.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization format');
    }
    try {
      const data = this.Jwt.verify(token, {
        secret: String(process.env.REFRESG_SEKRET),
      });
      if (data.role === BarberRole.BARBER_SHOP) {
        const barberShop = await this.barberShop.findOne({
          where: { id: data.id },
        });
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
    }
  }
}

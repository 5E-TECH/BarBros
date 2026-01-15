import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BarberShopServicesService } from './barber-shop-services.service';
import { CreateBarberShopServiceDto } from './dto/create-barber-shop-service.dto';
import { UpdateBarberShopServiceDto } from './dto/update-barber-shop-service.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/role.guard';
import { Roles } from 'src/common/Decorator/Role.decorator';
import { UserRole } from 'src/common/enum';
import { ApiOperation } from '@nestjs/swagger';

@Controller('barber-shop-services')
export class BarberShopServicesController {
  constructor(
    private readonly barberShopServicesService: BarberShopServicesService,
  ) {}

  @ApiOperation({ summary: 'BarberShopga service biriktirish' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SP_ADMIN, UserRole.SUPPER_ADMIN, UserRole.ADMIN)
  @Post()
  create(@Body() dto: CreateBarberShopServiceDto, @Req() req) {
    return this.barberShopServicesService.create(dto, req);
  }

  @ApiOperation({ summary: 'BarberShop servicelar ro‘yxati' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(
    UserRole.SP_ADMIN,
    UserRole.SUPPER_ADMIN,
    UserRole.ADMIN,
    UserRole.USER,
    UserRole.BARBER,
  )
  @Get()
  findAll(@Req() req) {
    return this.barberShopServicesService.findAll(req);
  }

  @ApiOperation({ summary: 'BarberShop service ma`lumotlari' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(
    UserRole.SP_ADMIN,
    UserRole.SUPPER_ADMIN,
    UserRole.ADMIN,
    UserRole.USER,
    UserRole.BARBER,
  )
  @Get(':id')
  findOne(@Param('id') id: number, @Req() req) {
    return this.barberShopServicesService.findOne(Number(id), req);
  }

  @ApiOperation({ summary: 'BarberShop service yangilash' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SP_ADMIN, UserRole.SUPPER_ADMIN, UserRole.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() dto: UpdateBarberShopServiceDto,
    @Req() req,
  ) {
    return this.barberShopServicesService.update(Number(id), dto, req);
  }

  @ApiOperation({ summary: 'BarberShop service o‘chirish' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SP_ADMIN, UserRole.SUPPER_ADMIN, UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: number, @Req() req) {
    return this.barberShopServicesService.remove(Number(id), req);
  }
}

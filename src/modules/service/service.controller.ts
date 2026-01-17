import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/role.guard';
import { Roles } from 'src/common/Decorator/Role.decorator';
import { UserRole } from 'src/common/enum';
import { Request } from 'express';
import { AddBarbersToServiceDto } from './dto/addbarbertoservice.dto';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SP_ADMIN, UserRole.SUPPER_ADMIN)
  @Post()
  create(@Body() createServiceDto: CreateServiceDto, @Req() req) {
    return this.serviceService.creates(createServiceDto, req.user);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(
    UserRole.SUPPER_ADMIN,
    UserRole.ADMIN,
    UserRole.SP_ADMIN,
    UserRole.BARBER,
    UserRole.USER,
  )
  @Get()
  findAll() {
    return this.serviceService.findAll();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SP_ADMIN, UserRole.BARBER)
  @Get('my-service')
  findAllMyservices(@Req() req ) {
    return this.serviceService.findAllMyServices(req.user);
  }

  @ApiOperation({
    summary: 'Barber bo‘yicha servicelar (public)',
  })
  @Get('by-barber/:barberId')
  findByBarber(@Param('barberId') barberId: number) {
    return this.serviceService.findByBarberId(barberId);
  }

  @ApiOperation({
    summary: 'BarberShop bo‘yicha servicelar (public)',
  })
  @Get('by-barber-shop/:barberShopId')
  findByBarberShop(@Param('barberShopId') barberShopId: number) {
    return this.serviceService.findByBarberShopId(barberShopId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(
    UserRole.SUPPER_ADMIN,
    UserRole.ADMIN,
    UserRole.SP_ADMIN,
    UserRole.BARBER,
    UserRole.USER,
  )
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.serviceService.findOne(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SP_ADMIN, UserRole.SUPPER_ADMIN, UserRole.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateServiceDto: UpdateServiceDto,
    @Req() req: Request,
  ) {
    return this.serviceService.update(id, updateServiceDto, req);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SP_ADMIN, UserRole.SUPPER_ADMIN, UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: number, @Req() req: Request) {
    return this.serviceService.remove(id, req);
  }

  @ApiOperation({
    summary: 'Mavjud service ga barber qo‘shish (BarberShop faqat)',
  })
  @ApiBody({
    type: AddBarbersToServiceDto,
    description: 'Service id va barberlar id listi',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SP_ADMIN)
  @Post('add-barbers')
  async addBarbersToService(@Body() dto: AddBarbersToServiceDto, @Req() req) {
    // Token orqali olingan barber_shop id

    // Service logikasini chaqiramiz
    return this.serviceService.addBarbersToService(dto, req.user.id);
  }
}

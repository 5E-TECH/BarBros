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
import { BarberRole, UserRole } from 'src/common/enum';
import { Request } from 'express';

@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(BarberRole.BARBER, UserRole.SUPPER_ADMIN)
  @Post()
  create(@Body() createServiceDto: CreateServiceDto, @Req() req: Request) {
    return this.serviceService.creates(createServiceDto, req);
  }
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.serviceService.findAll();
  }
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.serviceService.findOne(id);
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(BarberRole.BARBER)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateServiceDto: UpdateServiceDto,
    @Req() req: Request,
  ) {
    return this.serviceService.update(id, updateServiceDto, req);
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(BarberRole.BARBER)
  @Delete(':id')
  remove(@Param('id') id: number, @Req() req: Request) {
    return this.serviceService.remove(id, req);
  }
}

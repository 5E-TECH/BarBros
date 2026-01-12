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
import { BarberScheduleService } from './barber_schedule.service';
import { CreateBarberScheduleDto } from './dto/create-barber_schedule.dto';
import { UpdateBarberScheduleDto } from './dto/update-barber_schedule.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { UserRole } from 'src/common/enum';
import { Roles } from 'src/common/Decorator/Role.decorator';
import { RolesGuard } from 'src/common/guard/role.guard';
import { Request } from 'express';
import { ApiOperation } from '@nestjs/swagger';

@Controller('barber-schedule')
export class BarberScheduleController {
  constructor(private readonly barberScheduleService: BarberScheduleService) {}


  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SP_ADMIN, UserRole.ADMIN, UserRole.SUPPER_ADMIN)
  @Post()
  create(
    @Body() createBarberScheduleDto: CreateBarberScheduleDto,
    @Req() req: Request,
  ) {
    return this.barberScheduleService.create(createBarberScheduleDto, req);
  }



  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.barberScheduleService.findAll();
  }
  @ApiOperation({
    summary: 'Barber Uchun',
  })



  @UseGuards(AuthGuard)
  @Get('getSchedulesByBarber')
  getSchedulesByBarber(@Req() req: Request) {
    return this.barberScheduleService.getSchedulesByBarber(req);
  }


  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.barberScheduleService.findOne(id);
  }



  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SP_ADMIN,UserRole.SUPPER_ADMIN,)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateBarberScheduleDto: UpdateBarberScheduleDto,
    @Req() req: Request,
  ) {
    return this.barberScheduleService.update(id, updateBarberScheduleDto, req);
  }



  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.BARBER)
  @Delete(':id')
  remove(@Param('id') id: number, @Req() req: Request) {
    return this.barberScheduleService.remove(id, req);
  }
}

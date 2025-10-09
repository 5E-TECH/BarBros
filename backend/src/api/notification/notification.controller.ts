import { Controller, Get, Post, Body, Param, UseGuards, Delete } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/role.guard';
import { Roles } from 'src/common/Decorator/Role.decorator';
import { BarberRole, UserRole } from 'src/common/enum';
import { ApiOperation } from '@nestjs/swagger';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}
  
  @ApiOperation({summary: "Admin uchun"})
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPPER_ADMIN, UserRole.ADMIN, BarberRole.BARBER_SHOP)
  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }
  @ApiOperation({summary: "Admin uchun"})
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPPER_ADMIN, UserRole.ADMIN, BarberRole.BARBER_SHOP)
  @Get()
  findAll() {
    return this.notificationService.findAll();
  }

  @ApiOperation({summary: "Admin uchun"})
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPPER_ADMIN, UserRole.ADMIN)
  @Delete()
  delete(@Param("id")id: string){
    return this.notificationService.delet(id)
  }

}

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Delete,
  Req,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/role.guard';
import { Roles } from 'src/common/Decorator/Role.decorator';
import { UserRole } from 'src/common/enum';
import { ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}
  
  @ApiOperation({summary: "Admin uchun"})
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPPER_ADMIN, UserRole.ADMIN, UserRole.SP_ADMIN)
  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }
  @ApiOperation({summary: "Admin uchun"})
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPPER_ADMIN, UserRole.ADMIN, UserRole.SP_ADMIN)
  @Get()
  findAll() {
    return this.notificationService.findAll();
  }

  @ApiOperation({ summary: 'User yoki Barber uchun' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.USER, UserRole.BARBER)
  @Get('my')
  findMy(@Req() req: Request) {
    return this.notificationService.findMy(req);
  }

  @ApiOperation({summary: "Admin uchun"})
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPPER_ADMIN, UserRole.ADMIN)
  @Delete(':id')
  delete(@Param("id")id: number){
    return this.notificationService.delet(id)
  }

}

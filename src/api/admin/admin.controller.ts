import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Get,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminLoginDto } from './dto/login -admin.dto';
import { UpdateAdminDto } from './dto/updateAdmin.dto';
import { RefreshPasswordDto } from '../admin/dto/RefreshPassword.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/role.guard';
import { Roles } from 'src/common/Decorator/Role.decorator';
import { UserRole } from 'src/common/enum';
import { Request } from 'express';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CreateAdminDto } from './dto/create-admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}


  @UseGuards(AuthGuard,RolesGuard)
  @Roles(UserRole.SUPPER_ADMIN)
  @Post('create')
  createAdmin(@Body() data: CreateAdminDto, @Req() req: Request) {
    return this.adminService.createAdmin(data, req);
  }

  @Post('signin')
  login(@Body() loginDto: AdminLoginDto) {
    return this.adminService.login(loginDto);
  }

  @ApiOperation({ summary: 'Supper admin uchun' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPPER_ADMIN)
  @Get('all')
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  findAll(@Query() query: Record<string, any>) {
    return this.adminService.findAll(query);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPPER_ADMIN, UserRole.ADMIN)
  @Get('my-account')
  myAccount(@Req() req: Request) {
    return this.adminService.my_accaunt(req);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPPER_ADMIN)
  @Get('one/:id')
  findOne(@Param('id') id: number) {
    return this.adminService.findOne(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPPER_ADMIN, UserRole.ADMIN)
  @Patch('update/:id')
  update(
    @Param('id') id: number,
    @Body() data: UpdateAdminDto,
    @Req() req: Request,
  ) {
    return this.adminService.updateAdmin(id, data, req);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPPER_ADMIN)
  @Delete('delete/:id')
  delete(@Param('id') id: number) {
    return this.adminService.delete(id);
  }

  @ApiOperation({ summary: 'Supper admin va admin uchun' })
  @Post('refresh-password')
  refreshPassword(@Body() data: RefreshPasswordDto) {
    return this.adminService.refreshPassword(data);
  }
}

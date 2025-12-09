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
<<<<<<< HEAD
import { RegisterUserDto } from '../user/dto/register-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { OtpBarberDto } from '../barber/dto/Otp-barber.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { Roles } from 'src/common/Decorator/Role.decorator';
import { UserRole } from 'src/common/enum';
import { RolesGuard } from 'src/common/guard/role.guard';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { UpdateAdminDto } from './dto/updateAdmin.dto';
import { Request } from 'express';
import { RefreshPasswortDto } from './dto/RefreshPassword.dto';
=======
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
>>>>>>> decbac9 (frony)

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

<<<<<<< HEAD
  @ApiOperation({
    summary: 'Admin Creyted Supper_admin tomonidan',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPPER_ADMIN)
  @Post('signup')
  register(@Body() registerUserDti: RegisterUserDto) {
    return this.adminService.register(registerUserDti);
  }

  @Post('signin')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.adminService.login(loginUserDto);
  }

  @Post('verify_otp')
  verify(@Body() data: OtpBarberDto) {
    return this.adminService.VarifyOtp(data);
  }

  @ApiOperation({summary:"Supper admin uchum"})
=======

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
>>>>>>> decbac9 (frony)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPPER_ADMIN)
  @Get('all')
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
<<<<<<< HEAD
  @ApiQuery({ name: 'full_name', required: false })
  @ApiQuery({name: "phone_number", required: false})
  @ApiQuery({name: "email", required: false})
  @ApiQuery({ name: 'sortBy', required: false, enum: ['phone_number', 'full_name', "email"] })
  @ApiQuery({name: "order", required: false, enum:["asc","desc"]})
=======
>>>>>>> decbac9 (frony)
  findAll(@Query() query: Record<string, any>) {
    return this.adminService.findAll(query);
  }

<<<<<<< HEAD


  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPPER_ADMIN, UserRole.ADMIN)
  @Get('My_accaunt')
  my_accaunt(@Req() req: Request) {
    return this.adminService.my_accaunt(req);
  }

  @ApiOperation({summary:"Supper admin uchum"})
=======
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPPER_ADMIN, UserRole.ADMIN)
  @Get('my-account')
  myAccount(@Req() req: Request) {
    return this.adminService.my_accaunt(req);
  }

>>>>>>> decbac9 (frony)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPPER_ADMIN)
  @Get('one/:id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(id);
  }
<<<<<<< HEAD
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPPER_ADMIN, UserRole.ADMIN)
  @Patch('Update/:id')
=======

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPPER_ADMIN, UserRole.ADMIN)
  @Patch('update/:id')
>>>>>>> decbac9 (frony)
  update(
    @Param('id') id: string,
    @Body() data: UpdateAdminDto,
    @Req() req: Request,
  ) {
    return this.adminService.updateAdmin(id, data, req);
  }

<<<<<<< HEAD
  @ApiOperation({summary:"Supper admin uchum"})
=======
>>>>>>> decbac9 (frony)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPPER_ADMIN)
  @Delete('delete/:id')
  delete(@Param('id') id: string) {
    return this.adminService.delete(id);
  }

<<<<<<< HEAD

  @ApiOperation({summary: "Supper admin va admin uchun"})
  @Post("Refresh_Password")
  RefreshPassword(@Body() data: RefreshPasswortDto){
    return this.adminService.RefreshPassword(data)
=======
  @ApiOperation({ summary: 'Supper admin va admin uchun' })
  @Post('refresh-password')
  refreshPassword(@Body() data: RefreshPasswordDto) {
    return this.adminService.refreshPassword(data);
>>>>>>> decbac9 (frony)
  }
}

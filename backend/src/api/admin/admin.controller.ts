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
import { RegisterUserDto } from '../user/dto/register-user.dto';
import { LoginAdminDto } from './dto/login -admin.dto';
import { OtpBarberDto } from '../barber/dto/Otp-barber.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { Roles } from 'src/common/Decorator/Role.decorator';
import { UserRole } from 'src/common/enum';
import { RolesGuard } from 'src/common/guard/role.guard';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { UpdateAdminDto } from './dto/updateAdmin.dto';
import { Request } from 'express';
import { RefreshPasswortDto } from './dto/RefreshPassword.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('signin')
  login(@Body() loginAdminDto: LoginAdminDto) {
    return this.adminService.login(loginAdminDto);
  }

  @ApiOperation({summary:"Supper admin uchum"})
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPPER_ADMIN)
  @Get('all')
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'full_name', required: false })
  @ApiQuery({name: "phone_number", required: false})
  @ApiQuery({name: "email", required: false})
  @ApiQuery({ name: 'sortBy', required: false, enum: ['phone_number', 'full_name', "email"] })
  @ApiQuery({name: "order", required: false, enum:["asc","desc"]})
  findAll(@Query() query: Record<string, any>) {
    return this.adminService.findAll(query);
  }



  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPPER_ADMIN, UserRole.ADMIN)
  @Get('My_accaunt')
  my_accaunt(@Req() req: Request) {
    return this.adminService.my_accaunt(req);
  }

  @ApiOperation({summary:"Supper admin uchum"})
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPPER_ADMIN)
  @Get('one/:id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(id);
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPPER_ADMIN, UserRole.ADMIN)
  @Patch('Update/:id')
  update(
    @Param('id') id: string,
    @Body() data: UpdateAdminDto,
    @Req() req: Request,
  ) {
    return this.adminService.updateAdmin(id, data, req);
  }

  @ApiOperation({summary:"Supper admin uchum"})
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPPER_ADMIN)
  @Delete('delete/:id')
  delete(@Param('id') id: string) {
    return this.adminService.delete(id);
  }


  @ApiOperation({summary: "Supper admin va admin uchun"})
  @Post("refresh_rassword")
  RefreshPassword(@Body() data: RefreshPasswortDto){
    return this.adminService.RefreshPassword(data)
  }
}

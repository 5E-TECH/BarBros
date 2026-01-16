import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { SelfGuard } from 'src/common/guard/self.guard';
import { RolesGuard } from 'src/common/guard/role.guard';
import { Roles } from 'src/common/Decorator/Role.decorator';
import { UserRole } from 'src/common/enum';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/common/Decorator/user.decarator';
import { JWTPayload } from 'src/utils/user.type';
import { FullNameDto, RegisterDto, VerifyDto } from './dto/auth-dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AdminLoginDto } from './dto/login -admin.dto';
import { UpdateAdminDto } from './dto/updateAdmin.dto';
import { RefreshAdminPasswordDto } from './dto/Refresh-Admin-Password.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPPER_ADMIN)
  @Post('create-admin')
  createAdmin(@Body() data: CreateAdminDto, @Req() req: Request) {
    return this.userService.createAdmin(data, req);
  }

  @Post('signin-admin')
  login(@Body() loginDto: AdminLoginDto) {
    return this.userService.loginAdmin(loginDto);
  }

  @ApiOperation({ summary: 'Supper admin uchun' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPPER_ADMIN)
  @Get('all-admin')
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  findAllAdmin(@Query() query: Record<string, any>) {
    return this.userService.findAllAdmin(query);
  }


  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPPER_ADMIN)
  @Get('one/:id')
  findOneAdmin(@Param('id') id: number) {
    return this.userService.findOneAdmin(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPPER_ADMIN, UserRole.ADMIN)
  @Patch('update/:id')
  updateAdmin(
    @Param('id') id: number,
    @Body() data: UpdateAdminDto,
    @Req() req: Request,
  ) {
    return this.userService.updateAdmin(id, data, req);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPPER_ADMIN)
  @Delete('delete/:id')
  delete(@Param('id') id: number) {
    return this.userService.deleteAdmin(id);
  }

    @ApiOperation({ summary: 'Supper admin va admin uchun' })
  @Post('refresh-password')
  refreshPassword(@Body() data: RefreshAdminPasswordDto) {
    return this.userService.refreshPasswordAdmin(data);
  }

  ///////////////////////////////  USER--------------///////////////////////////

  @ApiOperation({ summary: 'Register user (send phone number)' })
  @ApiResponse({
    status: 201,
    description: 'Code sent successfully (0000 test code)',
  })
  @ApiResponse({ status: 400, description: 'Invalid phone number' })
  @Post('register')
  register(@Body() data: RegisterDto) {
    return this.userService.register(data.phone_number);
  }

  @ApiOperation({ summary: 'Verify code and get access token' })
  @ApiResponse({
    status: 200,
    description: 'Code verified, token generated',
  })
  @ApiResponse({ status: 403, description: 'Wrong code or user not found' })
  @Post('verify')
  verify(@Body() data: VerifyDto) {
    return this.userService.verifyCode(data.phone_number, data.code);
  }

  @ApiOperation({ summary: 'Set full name for user' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Full name saved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AuthGuard)
  @Patch('set-fullname')
  setFullName(@CurrentUser() user: JWTPayload, @Body() data: FullNameDto) {
    return this.userService.setFullName(user.id, data.full_name);
  }

  @ApiOperation({ summary: 'Supper admin uchum' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPPER_ADMIN)
  @Get('all')
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'full_name', required: false })
  @ApiQuery({ name: 'phone_number', required: false })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['phone_number', 'full_name'],
  })
  @ApiQuery({ name: 'order', required: false, enum: ['asc', 'desc'] })
  findAll(@Query() query: Record<string, any>) {
    return this.userService.findAll(query);
  }


  @ApiOperation({
    summary: 'Get user profile',
    description: 'Get current user profile information',
  })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPPER_ADMIN, UserRole.USER)
  @Get('profile')
  profile(@CurrentUser() user: JWTPayload) {
    return this.userService.profile(user);
  }

  @UseGuards(AuthGuard, SelfGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }
  @UseGuards(AuthGuard, SelfGuard)
  @Patch(':id')
  update(@Param('id') id: number, @Body() data: UpdateUserDto) {
    return this.userService.update(id, data);
  }

  @UseGuards(AuthGuard, SelfGuard)
  @Delete(':id')
  delet(@Param('id') id: number) {
    return this.userService.delet(id);
  }
}

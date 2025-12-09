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
<<<<<<< HEAD
import { RegisterUserDto } from './dto/register-user.dto';
=======
>>>>>>> decbac9 (frony)
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { SelfGuard } from 'src/common/guard/self.guard';
import { RolesGuard } from 'src/common/guard/role.guard';
import { Roles } from 'src/common/Decorator/Role.decorator';
import { UserRole } from 'src/common/enum';
import { Request } from 'express';
<<<<<<< HEAD
import { RefreshPasswortDto } from '../admin/dto/RefreshPassword.dto';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
=======
import { RefreshPasswordDto } from '../admin/dto/RefreshPassword.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/common/Decorator/user.decarator';
import { JWTPayload } from 'src/infrostructure/utils/user.type';
import { FullNameDto, RegisterDto, VerifyDto } from './dto/auth-dto';
>>>>>>> decbac9 (frony)

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

<<<<<<< HEAD
  @Post('Siginup')
  register(@Body() registerUserDti: RegisterUserDto) {
    return this.userService.register(registerUserDti);
=======
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
  @Post('set-fullname')
  setFullName(@CurrentUser() user: JWTPayload, @Body() data: FullNameDto) {
    return this.userService.setFullName(user.id, data.full_name);
>>>>>>> decbac9 (frony)
  }

  @Post('Signin')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }
<<<<<<< HEAD
  @ApiOperation({summary:"Supper admin uchum"})
=======

  @ApiOperation({ summary: 'Supper admin uchum' })
>>>>>>> decbac9 (frony)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPPER_ADMIN)
  @Get('all')
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'full_name', required: false })
<<<<<<< HEAD
  @ApiQuery({name: "phone_number", required: false})
  @ApiQuery({name: "email", required: false})
  @ApiQuery({ name: 'sortBy', required: false, enum: ['phone_number', 'full_name', "email"] })
  @ApiQuery({name: "order", required: false, enum:["asc","desc"]})
=======
  @ApiQuery({ name: 'phone_number', required: false })
  @ApiQuery({ name: 'email', required: false })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['phone_number', 'full_name', 'email'],
  })
  @ApiQuery({ name: 'order', required: false, enum: ['asc', 'desc'] })
>>>>>>> decbac9 (frony)
  findAll(@Query() query: Record<string, any>) {
    return this.userService.findAll(query);
  }

<<<<<<< HEAD
 @UseGuards(AuthGuard)
  @Get("My_Accaunt")
  my_accaunt(@Req()req:Request){
    return this.userService.My_accaunt(req)
=======
  @UseGuards(AuthGuard)
  @Get('my_accaunt')
  my_accaunt(@Req() req: Request) {
    return this.userService.My_accaunt(req);
>>>>>>> decbac9 (frony)
  }

  @UseGuards(AuthGuard, SelfGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
  @UseGuards(AuthGuard, SelfGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateUserDto) {
    return this.userService.update(id, data);
  }

  @UseGuards(AuthGuard, SelfGuard)
  @Delete(':id')
  delet(@Param('id') id: string) {
    return this.userService.delet(id);
  }

<<<<<<< HEAD
  @Post("Refresh_password")
  refresh_password(@Body() data: RefreshPasswortDto){
    return this.userService.RefreshPassword(data)
=======
  @ApiOperation({
    summary: 'Get user profile',
    description: 'Get current user profile information',
  })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, SelfGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPPER_ADMIN, UserRole.USER)
  @Get('profile')
  profile(@CurrentUser() user: JWTPayload) {
    return this.userService.profile(user);
>>>>>>> decbac9 (frony)
  }
}

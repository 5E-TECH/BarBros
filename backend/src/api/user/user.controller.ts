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
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { SelfGuard } from 'src/common/guard/self.guard';
import { RolesGuard } from 'src/common/guard/role.guard';
import { Roles } from 'src/common/Decorator/Role.decorator';
import { UserRole } from 'src/common/enum';
import { Request } from 'express';
import { RefreshPasswortDto } from '../admin/dto/RefreshPassword.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/common/Decorator/user.decarator';
import { JWTPayload } from 'src/infrostructure/utils/user.type';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('Siginup')
  register(@Body() registerUserDti: RegisterUserDto) {
    return this.userService.register(registerUserDti);
  }

  @Post('Signin')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }
  @ApiOperation({ summary: 'Supper admin uchum' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPPER_ADMIN)
  @Get('all')
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'full_name', required: false })
  @ApiQuery({ name: 'phone_number', required: false })
  @ApiQuery({ name: 'email', required: false })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['phone_number', 'full_name', 'email'],
  })
  @ApiQuery({ name: 'order', required: false, enum: ['asc', 'desc'] })
  findAll(@Query() query: Record<string, any>) {
    return this.userService.findAll(query);
  }

  @UseGuards(AuthGuard)
  @Get('My_Accaunt')
  my_accaunt(@Req() req: Request) {
    return this.userService.My_accaunt(req);
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

  @Post('Refresh_password')
  refresh_password(@Body() data: RefreshPasswortDto) {
    return this.userService.RefreshPassword(data);
  }

  @ApiOperation({
    summary: 'Get user profile',
    description: 'Get current user profile information',
  })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard,SelfGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPPER_ADMIN, UserRole.USER)
  @Get('profile')
  profile(@CurrentUser() user: JWTPayload) {
    return this.userService.profile(user);
  }
  
  
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
  Req,
  Query,
} from '@nestjs/common';
import { BarberService } from './barber.service';
import { UpdateBarberDto } from './dto/update-barber.dto';
import { RegisterBarberDto } from './dto/register-barber.dto';
import { LoginBarberDto } from './dto/login-barber.dto';
import { OtpBarberDto } from './dto/Otp-barber.dto';
import { Roles } from 'src/common/Decorator/Role.decorator';
import { UserRole } from 'src/common/enum';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { SelfGuard } from 'src/common/guard/self.guard';
import { RolesGuard } from 'src/common/guard/role.guard';
import { ApiBody, ApiConsumes, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { BarberRefreshPasswordDto } from './dto/refreshPassword.doo';

@Controller('barber')
export class BarberController {
  constructor(private readonly barberService: BarberService) {}

  @ApiOperation({
    summary: 'Barber yaratish (BarberShop tomonidan)',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: [
        'full_name',
        'phone_number',
        'password',
        'username',
        'bio',
      ],
      properties: {
        full_name: {
          type: 'string',
          example: 'Faxriddin Maripov',
        },
        phone_number: {
          type: 'string',
          example: '+998930451852',
        },
        password: {
          type: 'string',
          example: '12345678',
        },
        username: {
          type: 'string',
          example: 'faxame',
        },
        bio: {
          type: 'string',
          example:
            '2 yildan ortiq tajribaga ega sartaroshman. Erkaklar soch turmaklari, soqol olish va styling xizmatlarini taklif qilaman. Toza va sifatli xizmat — mening ustuvorligim.',
        },
        img: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SP_ADMIN)
  @Post('create')
  @UseInterceptors(FileInterceptor('img'))
  register(
    @Req() req,
    @Body() registerBarberDto: RegisterBarberDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.barberService.create(registerBarberDto, req.user.id, file);
  }

  @Post('Signin')
  login(@Body() loginBarberDto: LoginBarberDto) {
    return this.barberService.login(loginBarberDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(
    UserRole.SUPPER_ADMIN,
    UserRole.ADMIN,
    UserRole.SP_ADMIN,
    UserRole.BARBER,
    UserRole.USER,
  )
  @Get('all')
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'full_name', required: false })
  @ApiQuery({ name: 'phone_number', required: false })
  @ApiQuery({ name: 'bio', required: false })
  @ApiQuery({ name: 'email', required: false })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['phone_number', 'full_name', 'email'],
  })
  @ApiQuery({ name: 'order', required: false, enum: ['asc', 'desc'] })
  findAll(@Query() query: Record<string, any>) {
    return this.barberService.findAll(query);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SP_ADMIN)
  @Get('all-myBarbers')
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'full_name', required: false })
  @ApiQuery({ name: 'phone_number', required: false })
  @ApiQuery({ name: 'bio', required: false })
  @ApiQuery({ name: 'email', required: false })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['phone_number', 'full_name', 'email'],
  })
  @ApiQuery({ name: 'order', required: false, enum: ['asc', 'desc'] })
  findAllMyBarbers(@Query() query: Record<string, any>, @Req() req) {
    return this.barberService.findAllMyBarbers(req, query);
  }

  @UseGuards(AuthGuard)
  @Get('My_Accaunt')
  my_accaunt(@Req() req: Request) {
    return this.barberService.myAccount(req);
  }

  @UseGuards(AuthGuard, SelfGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.barberService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update barber',
  })
   @UseGuards(AuthGuard, SelfGuard)
  @Get('barbershop/:id')
  findBarbershopId(@Param('id') id: number) {
    return this.barberService.findBarbershopId(id);
  }

  @ApiOperation({
    summary: 'Update barber',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        full_name: {
          type: 'string',
          example: 'Faxriddin Maripov',
        },
        phone_number: {
          type: 'string',
          example: '+998930451852',
        },
        bio: {
          type: 'string',
          example:
            '2 yildan ortiq tajribaga ega sartaroshman. Erkaklar soch turmaklari, soqol olish va styling xizmatlarini taklif qilaman. Toza va sifatli xizmat — mening ustuvorligim.',
        },
        is_avaylbl: {
          type: 'boolen',
          example: true,
        },
        img: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.BARBER, UserRole.SP_ADMIN, UserRole.SUPPER_ADMIN, UserRole.ADMIN)
  @Patch('update/:id')
  @UseInterceptors(FileInterceptor('img'))
  update(
    @Param('id') id: number,
    @Body() updateBarberDto: UpdateBarberDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    return this.barberService.update(id, updateBarberDto, req, file);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.BARBER, UserRole.SP_ADMIN, UserRole.SUPPER_ADMIN, UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: number, @Req() req: Request) {
    return this.barberService.remove(id, req);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.BARBER)
  @Post('refresh_password')
  refresh_password(@Body() data: BarberRefreshPasswordDto, @Req() req: Request) {
    return this.barberService.refreshPassword(data, req);
  }
}

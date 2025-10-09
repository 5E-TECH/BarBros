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
import { BarberRole, UserRole } from 'src/common/enum';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { SelfGuard } from 'src/common/guard/self.guard';
import { RolesGuard } from 'src/common/guard/role.guard';
import { ApiBody, ApiConsumes, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { RefreshPasswortDto } from '../admin/dto/RefreshPassword.dto';


@Controller('barber')
export class BarberController {
  constructor(private readonly barberService: BarberService) {}

  @ApiOperation({
    summary: 'Created barber BarberShop yoki Admin tomonidan',
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
        password: {
          type: 'string',
          example: '12345678',
        },
        email: {
          type: 'string',
          example: 'karalevstvabitba@gmail.com',
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

        barberShop_id: {
          type: 'string',
          example: 'barberShop_id',
        },
      },
    },
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPPER_ADMIN, UserRole.ADMIN,BarberRole.BARBER_SHOP)
  @Post('Signup')
  @UseInterceptors(FileInterceptor('img'))
  register(
    @Body() registerBarberDto: RegisterBarberDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.barberService.register(registerBarberDto, file);
  }

  @Post('Signin')
  login(@Body() loginBarberDto: LoginBarberDto) {
    return this.barberService.login(loginBarberDto);
  }
  @Post('verify_otp')
  verify_otp(@Body() data: OtpBarberDto) {
    return this.barberService.VarifyOtp(data);
  }

  @UseGuards(AuthGuard)
  @Get('all')
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'full_name', required: false })
  @ApiQuery({name: "phone_number", required: false})
  @ApiQuery({name: "bio", required: false})
  @ApiQuery({name: "email", required: false})
  @ApiQuery({ name: 'sortBy', required: false, enum: ['phone_number', 'full_name', "email"] })
  @ApiQuery({name: "order", required: false, enum:["asc","desc"]})
  findAll(@Query() query: Record<string, any>) {
    return this.barberService.findAll(query);
  }


  @UseGuards(AuthGuard)
  @Get("My_Accaunt")
  my_accaunt(@Req()req:Request){
    return this.barberService.My_accaunt(req)
  }

  @UseGuards(AuthGuard, SelfGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.barberService.findOne(id);
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
  @UseGuards(AuthGuard,SelfGuard)
  @Patch('update:id')
  @UseInterceptors(FileInterceptor('img'))
  update(
    @Param('id') id: string,
    @Body() updateBarberDto: UpdateBarberDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.barberService.update(id, updateBarberDto, file);
  }

  @UseGuards(AuthGuard, SelfGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.barberService.remove(id);
  }

  @Post("Refresh_password")
  refresh_password(@Body() data: RefreshPasswortDto){
    return this.barberService.RefreshPassword(data)
  }
}

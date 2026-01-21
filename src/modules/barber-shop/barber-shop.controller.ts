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
  UploadedFile,
  Req,
  Query,
} from '@nestjs/common';
import { BarberShopService } from './barber-shop.service';
import { CreateBarberShopDto } from './dto/create-barber-shop.dto';
import { UpdateBarberShopDto } from './dto/update-barber-shop.dto';
import { UpdateBarberShopStatus } from './dto/update-status';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/role.guard';
import { Roles } from 'src/common/Decorator/Role.decorator';
import { UserRole } from 'src/common/enum';
import { ApiBody, ApiConsumes, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { LogimBarberShopDto } from './dto/login-barber-shop.dto';
import { Request } from 'express';
import { BarberShopRefreshPasswordDto } from './dto/refreshPassword.dto';

@Controller('barber-shop')
export class BarberShopController {
  constructor(private readonly barberShopService: BarberShopService) {}

  @ApiOperation({
    summary: 'Created barberShop  Admin tomonidan',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Barber Shop name',
        },
        location: {
          type: 'string',
          example: 'lince',
        },
        latitude: {
          type: 'number',
          example: 41.2995,
        },
        longitude: {
          type: 'number',
          example: 69.2401,
        },
        password: {
          type: 'string',
          example: '12345678',
        },
        username: {
          type: 'string',
          example: 'bar bro',
        },
        img: { type: 'string', format: 'binary' },

        descripton: {
          type: 'string',
          example: 'Berber shop haqida',
        },
        phoneNumber: {
          type: 'string',
          example: '+998930451852',
        },
      },
    },
  })
  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles(UserRole.SUPPER_ADMIN)
  @Post('Signup')
  @UseInterceptors(FileInterceptor('img'))
  register(
    @Body() createBarberShopDto: CreateBarberShopDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.barberShopService.signup(createBarberShopDto, file);
  }

  @Post('Singin')
  login(@Body() logimBarberShopDto: LogimBarberShopDto) {
    return this.barberShopService.login(logimBarberShopDto);
  }


  @UseGuards(AuthGuard)
  @Get()
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'descripton', required: false })
  @ApiQuery({name: "location", required: false})
  @ApiQuery({ name: 'lat', required: false })
  @ApiQuery({ name: 'lng', required: false })
  @ApiQuery({ name: 'radiusKm', required: false })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['name', 'descripton', 'distance', 'avg_rating'],
  })
  @ApiQuery({name: "order", required: false, enum:["asc","desc"]})
  findAll(@Query() query: Record<string, any>) {
    return this.barberShopService.findAll(query);
  }

  @ApiOperation({ summary: 'Service bo‘yicha shoplar (price, rating, distance)' })
  @UseGuards(AuthGuard)
  @Get('by-service')
  @ApiQuery({ name: 'serviceId', required: true })
  @ApiQuery({ name: 'lat', required: false })
  @ApiQuery({ name: 'lng', required: false })
  @ApiQuery({ name: 'radiusKm', required: false })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['distance', 'avg_rating'] })
  findByService(@Query() query: Record<string, any>) {
    return this.barberShopService.findByService(query);
  }
  @UseGuards(AuthGuard)
  @Get('My_Accaunt')
  my_accaunt(@Req() req: Request) {
    return this.barberShopService.myAccount(req);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.barberShopService.findOne(id);
  }
  

  @ApiOperation({ summary: 'Supper admin Tomonidan bloklansa' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPPER_ADMIN,UserRole.ADMIN)
  @Patch('status/:id')
  updateStatus(
    @Param('id') id: number,
    @Body() status: UpdateBarberShopStatus,
  ) {
    return this.barberShopService.statusUpdate(id, status);
  }

  @ApiOperation({
    summary: 'Update barberShop',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Barber Shop name',
        },
        location: {
          type: 'string',
          example: 'lince',
        },
        latitude: {
          type: 'number',
          example: 41.2995,
        },
        longitude: {
          type: 'number',
          example: 69.2401,
        },
        img: {
          type: 'string',
          format: 'binary',
        },
        descripton: {
          type: 'string',
          example: 'Berber shop haqida',
        },
        phoneNumber: {
          type: 'string',
          example: '+998930451852',
        },
      },
    },
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SP_ADMIN, UserRole.SUPPER_ADMIN)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('img'))
  update(
    @Param('id') id: number,
    @Body() updateBarberShopDto: UpdateBarberShopDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    return this.barberShopService.update(id, updateBarberShopDto, file, req);
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPPER_ADMIN)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.barberShopService.remove(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SP_ADMIN)
  @Post('Refresh_password')
  refresh_password(@Body() data: BarberShopRefreshPasswordDto) {
    return this.barberShopService.refreshPassword(data);
  }
}

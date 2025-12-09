import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Query,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { Request } from 'express';
import { RolesGuard } from 'src/common/guard/role.guard';
import { Roles } from 'src/common/Decorator/Role.decorator';
import { BarberRole, UserRole } from 'src/common/enum';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createBookingDto: CreateBookingDto, @Req() req: Request) {
    return this.bookingService.create(createBookingDto, req);
  }

  @ApiOperation({summary: "cancellation"})
  @Delete("Update_schedule")
  delet(@Param('id')id: string, @Body() data: UpdateBookingDto ){
    return this.bookingService.delet(data, id)
  }

  @ApiOperation({ summary: 'Barberlar uchun' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(BarberRole.BARBER)
  @Get('Barber_bookig')
  findAll(@Req() req: Request) {
    return this.bookingService.findAllBarber(req);
  }

  @ApiOperation({summary: "Abmin va supper_admin uchun"})
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPPER_ADMIN, UserRole.ADMIN)
  @Get("All")
  findAll_Admin(){
    return this.bookingService.findAll_Abdin()
  }

  @ApiOperation({ summary: 'Userlar uchun' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  @Get('User_booking')
  findOne(@Req() req: Request) {
    return this.bookingService.findAllUser(req);
  }

  @Get('availability')
  @ApiOperation({ summary: 'Check barber availability' })
  @ApiQuery({ 
    name: 'barberId', 
    type: String, 
    required: true, 
    example: '123abc456def', 
    description: 'ID of the barber' 
  })
  @ApiQuery({ 
    name: 'date', 
    type: String, 
    required: true, 
    example: '2025-07-10', 
    description: 'Date in YYYY-MM-DD format' 
  })
  @ApiQuery({ 
    name: 'serviceId', 
    type: String, 
    required: true, 
    example: 'svc789xyz', 
    description: 'ID of the service to be checked for availability' 
  })
  async getAvailability(
    @Query('barberId') barberId: string,
    @Query('date') date: string,
    @Query("serviceId") serviceId: string
  ) {
    return await this.bookingService.getBarberAvailability(barberId, date, serviceId);
  }
}

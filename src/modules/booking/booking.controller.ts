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
import { UserRole } from 'src/common/enum';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { CreateOfflineBookingDto } from './dto/create-offline-booking.dto';
import { SubscriptionGuard } from 'src/common/guard/subscription.guard';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  @Post()
  create(@Body() createBookingDto: CreateBookingDto, @Req() req: Request) {
    return this.bookingService.create(createBookingDto, req);
  }

  @ApiOperation({ summary: 'Offline booking (barber/shop)' })
  @UseGuards(AuthGuard, RolesGuard, SubscriptionGuard)
  @Roles(UserRole.BARBER, UserRole.SP_ADMIN)
  @Post('offline')
  createOffline(
    @Body() createBookingDto: CreateOfflineBookingDto,
    @Req() req: Request,
  ) {
    return this.bookingService.createOffline(createBookingDto, req);
  }

  @ApiOperation({ summary: 'cancellation' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.USER, UserRole.BARBER, UserRole.ADMIN, UserRole.SUPPER_ADMIN)
  @Delete(':id')
  cancel(@Param('id') id: number, @Req() req: Request) {
    return this.bookingService.cancel(id, req);
  }

  @ApiOperation({ summary: 'Booking status update' })
  @UseGuards(AuthGuard, RolesGuard, SubscriptionGuard)
  @Roles(
    UserRole.BARBER,
    UserRole.SP_ADMIN,
    UserRole.ADMIN,
    UserRole.SUPPER_ADMIN,
  )
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: number,
    @Body() dto: UpdateBookingDto,
    @Req() req: Request,
  ) {
    return this.bookingService.updateStatus(id, dto, req);
  }

  @ApiOperation({ summary: 'Barberlar uchun' })
  @UseGuards(AuthGuard, RolesGuard, SubscriptionGuard)
  @Roles(UserRole.BARBER, UserRole.SP_ADMIN)
  @Get('Barber_bookig')
  findAll(@Req() req: Request) {
    return this.bookingService.findAllBarber(req);
  }

  @ApiOperation({ summary: 'Abmin va supper_admin uchun' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPPER_ADMIN, UserRole.ADMIN)
  @Get('All')
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  findAll_Admin(@Query() query: Record<string, any>) {
    return this.bookingService.findAll_Abdin(query);
  }

  @ApiOperation({ summary: 'Userlar uchun' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.USER, UserRole.SUPPER_ADMIN, UserRole.ADMIN)
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
    description: 'ID of the barber',
  })
  @ApiQuery({
    name: 'date',
    type: String,
    required: true,
    example: '2025-07-10',
    description: 'Date in YYYY-MM-DD format',
  })
  @ApiQuery({
    name: 'serviceId',
    type: String,
    required: true,
    example: 'svc789xyz',
    description: 'ID of the service to be checked for availability',
  })
  async getAvailability(
    @Query('barberId') barberId: number,
    @Query('date') date: string,
    @Query('serviceId') serviceId: number,
  ) {
    return await this.bookingService.getBarberAvailability(
      barberId,
      date,
      serviceId,
    );
  }

  @Get('availability-range')
  @ApiOperation({ summary: 'Check barber availability for date range' })
  @ApiQuery({
    name: 'barberId',
    type: String,
    required: true,
    example: '1',
    description: 'ID of the barber',
  })
  @ApiQuery({
    name: 'from',
    type: String,
    required: true,
    example: '2025-07-01',
    description: 'Start date in YYYY-MM-DD format',
  })
  @ApiQuery({
    name: 'to',
    type: String,
    required: true,
    example: '2025-07-30',
    description: 'End date in YYYY-MM-DD format',
  })
  @ApiQuery({
    name: 'serviceId',
    type: String,
    required: true,
    example: '2',
    description: 'ID of the service',
  })
  async getAvailabilityRange(
    @Query('barberId') barberId: number,
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('serviceId') serviceId: number,
  ) {
    return await this.bookingService.getBarberAvailabilityRange(
      barberId,
      from,
      to,
      serviceId,
    );
  }

  @ApiOperation({
    summary: 'Shop + Service + time bo‘yicha bo‘sh barberlar',
  })
  @ApiQuery({ name: 'barberShopId', required: true, example: 3 })
  @ApiQuery({ name: 'serviceId', required: true, example: 1 })
  @ApiQuery({ name: 'date', required: true, example: '2025-12-12' })
  @ApiQuery({ name: 'time', required: true, example: '14:30:00' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  @Get('available-barbers')
  findAvailableBarbers(
    @Query('barberShopId') barberShopId: number,
    @Query('serviceId') serviceId: number,
    @Query('date') date: string,
    @Query('time') time: string,
  ) {
    return this.bookingService.findAvailableBarbers(
      barberShopId,
      serviceId,
      date,
      time,
    );
  }

  @ApiOperation({ summary: 'Admin/Superadmin uchun bitta booking' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPPER_ADMIN, UserRole.ADMIN)
  @Get('admin/:id')
  findOneAdmin(@Param('id') id: number) {
    return this.bookingService.findOneAdmin(id);
  }

  @ApiOperation({ summary: 'Admin/Superadmin uchun bitta userga tegishli booking' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPPER_ADMIN, UserRole.ADMIN)
  @Get('user-bookings/:userId')
  async getUserBookings(@Param('userId') userId: number) {
    return this.bookingService.findByUserId(userId);
  }
}

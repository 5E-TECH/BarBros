import { Controller, Get, UseGuards, Req, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/role.guard';
import { Roles } from 'src/common/Decorator/Role.decorator';
import { UserRole } from 'src/common/enum';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Request } from 'express';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @ApiOperation({ summary: 'Admin uchun barcha tranzaksiyalar' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPPER_ADMIN, UserRole.ADMIN)
  @Get()
  findAll() {
    return this.transactionsService.findAll();
  }

  @ApiOperation({ summary: 'SP_ADMIN uchun o‘z shop tranzaksiyalari' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SP_ADMIN)
  @Get('my-shop')
  findMyShop(@Req() req: Request) {
    return this.transactionsService.findMyShop(req);
  }

  @ApiOperation({ summary: 'Barber uchun o‘z tranzaksiyalari' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.BARBER)
  @Get('my-barber')
  findMyBarber(@Req() req: Request) {
    return this.transactionsService.findMyBarber(req);
  }

  @ApiOperation({ summary: 'Role bo‘yicha umumiy summa' })
  @ApiQuery({
    name: 'range',
    required: false,
    enum: ['daily', 'weekly', 'monthly'],
  })
  @ApiQuery({ name: 'startDate', required: false, example: '2025-01-01' })
  @ApiQuery({ name: 'endDate', required: false, example: '2025-01-31' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(
    UserRole.SP_ADMIN,
    UserRole.BARBER,
    UserRole.SUPPER_ADMIN,
    UserRole.ADMIN,
  )
  @Get('summary')
  summary(@Req() req: Request, @Query() query: Record<string, any>) {
    return this.transactionsService.summary(req, query);
  }
}

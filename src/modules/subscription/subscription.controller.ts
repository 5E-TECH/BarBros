import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { AssignSubscriptionDto } from './dto/assign-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { AssignByBarberDto } from './dto/assign-by-barber.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/role.guard';
import { Roles } from 'src/common/Decorator/Role.decorator';
import { UserRole } from 'src/common/enum';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/Decorator/user.decarator';
import { JWTPayload } from 'src/utils/user.type';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @ApiOperation({ summary: 'Plans list (public)' })
  @Get('plans')
  listPlans() {
    return this.subscriptionService.listPlans();
  }

  @ApiOperation({ summary: 'Create plan' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPPER_ADMIN, UserRole.ADMIN)
  @Post('plans')
  createPlan(@Body() dto: CreatePlanDto) {
    return this.subscriptionService.createPlan(dto);
  }

  @ApiOperation({ summary: 'Update plan' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPPER_ADMIN, UserRole.ADMIN)
  @Patch('plans/:id')
  updatePlan(@Param('id') id: number, @Body() dto: UpdatePlanDto) {
    return this.subscriptionService.updatePlan(id, dto);
  }

  @ApiOperation({ summary: 'Assign subscription to barber shop' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPPER_ADMIN, UserRole.ADMIN)
  @Post('assign')
  assign(@Body() dto: AssignSubscriptionDto) {
    return this.subscriptionService.assignSubscription(dto);
  }

  @ApiOperation({ summary: 'Assign subscription by barber id' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPPER_ADMIN, UserRole.ADMIN)
  @Post('assign-by-barber')
  assignByBarber(@Body() dto: AssignByBarberDto) {
    return this.subscriptionService.assignByBarber(dto);
  }

  @ApiOperation({ summary: 'Update subscription' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPPER_ADMIN, UserRole.ADMIN)
  @Patch(':id')
  updateSubscription(@Param('id') id: number, @Body() dto: UpdateSubscriptionDto) {
    return this.subscriptionService.updateSubscription(id, dto);
  }

  @ApiOperation({ summary: 'List subscriptions' })
  @ApiQuery({ name: 'barber_shop_id', required: false })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPPER_ADMIN, UserRole.ADMIN)
  @Get()
  listSubscriptions(@Query() query: Record<string, any>) {
    return this.subscriptionService.listSubscriptions(query);
  }

  @ApiOperation({ summary: 'My subscriptions (SP_ADMIN)' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SP_ADMIN)
  @Get('my')
  my(@CurrentUser() user: JWTPayload) {
    return this.subscriptionService.mySubscription(user);
  }

  @ApiOperation({ summary: 'Barbershops by plan id' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPPER_ADMIN, UserRole.ADMIN)
  @Get('by-plan/:planId')
  listByPlan(@Param('planId') planId: number) {
    return this.subscriptionService.listBarberShopsByPlan(planId);
  }
}

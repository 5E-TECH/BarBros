import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ReytingService } from './reyting.service';
import { CreateReytingDto } from './dto/create-reyting.dto';
import { Roles } from 'src/common/Decorator/Role.decorator';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/role.guard';
import { UserRole } from 'src/common/enum';
import { Request } from 'express';

@Controller('reyting')
export class ReytingController {
  constructor(private readonly reytingService: ReytingService) {}
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  @Post()
  create(@Body() createReytingDto: CreateReytingDto, @Req() req: Request) {
    return this.reytingService.create(createReytingDto, req);
  }
}

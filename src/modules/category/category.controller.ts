import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/role.guard';
import { Roles } from 'src/common/Decorator/Role.decorator';
import { UserRole } from 'src/common/enum';
import { CreateCategoryDto } from './dto/category.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({
    summary: 'Created category by SuperAdmin and or Admin',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPPER_ADMIN, UserRole.ADMIN)
  @Post('create')
  register(@Body() createCategory: CreateCategoryDto) {
    return this.categoryService.createCategory(createCategory);
  }

  @ApiOperation({
    summary: 'Get all category',
  })
  @UseGuards(AuthGuard)
  @Get('getAll')
  getAll() {
    return this.categoryService.getAllCategory();
  }
}

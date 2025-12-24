import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/role.guard';
import { Roles } from 'src/common/Decorator/Role.decorator';
import { Category, UserRole } from 'src/common/enum';
import { CreateCategoryDto } from './dto/category.dto';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({
    summary: 'Created category by SuperAdmin and or Admin',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Hair',
        },
        categoryType: {
        type: 'string',
        enum: Object.values(Category), // 🔥 SELECT BO‘LADI
        example: Category.MAN,
      },
        img: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPPER_ADMIN, UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('img'))
  @Post('create')
  register(@Body() createCategory: CreateCategoryDto,  @UploadedFile() img: Express.Multer.File,) {
    return this.categoryService.createCategory(createCategory, img);
  }

  @ApiOperation({
    summary: 'Get all category',
  })
  @UseGuards(AuthGuard)
  @Get('getAll')
  getAll() {
    return this.categoryService.getAllCategory();
  }

  @ApiOperation({
    summary: 'Get all category',
  })
  @UseGuards(AuthGuard)
  @Get('getAll-man')
  getAllManCategroy() {
    return this.categoryService.getAllManCategory();
  }

  @ApiOperation({
    summary: 'Get all category',
  })
  @UseGuards(AuthGuard)
  @Get('getAll-woman')
  getAllWomanCategory() {
    return this.categoryService.getAllWomanCategory();
  }


    @ApiOperation({
    summary: 'Update category by SuperAdmin and or Admin',
  })
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Hair style',
        },
        categoryType: {
          type: 'string',
          enum: Object.values(Category),
          example: Category.MAN,
        },
        img: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPPER_ADMIN, UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('img'))
  @Patch('update/:id')
  updateCategory(
    @Param('id') id: number,
    @Body() updateCategoryDto: CreateCategoryDto,
    @UploadedFile() img?: Express.Multer.File,
  ) {
    return this.categoryService.updateCategory(
      Number(id),
      updateCategoryDto,
      img,
    );
  }

  
@UseGuards(AuthGuard,RolesGuard)
@Roles(UserRole.SUPPER_ADMIN, UserRole.ADMIN)
@Delete(':id')
  remove(@Param('id') id:number, @Req() req:Request){
    return this.categoryService.deletCategory(id)
  }
}

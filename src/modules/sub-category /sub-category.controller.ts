import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SubCategoryService } from './sub-category.service';
import { CreateSubCategoryDto } from './dto/sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';

@Controller('sub-category')
export class SubCategoryController {
  constructor(private readonly subCategoryService: SubCategoryService) {}


  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Hair',
        },
        img: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })


  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() dto: CreateSubCategoryDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.subCategoryService.createSubCategory(dto, file);
  }

  @Get()
  findAll() {
    return this.subCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.subCategoryService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSubCategoryDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.subCategoryService.update(id, dto, file);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.subCategoryService.remove(id);
  }
}

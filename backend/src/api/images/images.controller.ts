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
  UploadedFiles,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/role.guard';
import { Roles } from 'src/common/Decorator/Role.decorator';
import { BarberRole } from 'src/common/enum';
import { Request } from 'express';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @ApiOperation({
    summary: 'Create image successfully',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        img: { type: 'array', items: { type: 'string', format: 'binary' } },
      },
    },
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(BarberRole.BARBER_SHOP)
  @Post()
  @UseInterceptors(FilesInterceptor('img'))
  create(
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: Request,
  ) {
    return this.imagesService.create(files, req);
  }
  @ApiOperation({summary:"Barcha uchun"})
  @UseGuards(AuthGuard)
  @Get('all')
  findAllUser() {
    return this.imagesService.findAll();
  }

  @ApiOperation({summary:"BarberShoplar uchun"})
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(BarberRole.BARBER_SHOP)
  @Get('BarberShop_all')
  findAllBarber(@Req() req: Request) {
    return this.imagesService.findAllBarber(req);
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(BarberRole.BARBER_SHOP)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.imagesService.remove(id, req);
  }
}

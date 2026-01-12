import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  Req,
} from '@nestjs/common';
import { BarberImagesService } from './barber_images.service';
import { CreateBarberImageDto } from './dto/create-barber_image.dto';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { SelfGuard } from 'src/common/guard/self.guard';
import { RolesGuard } from 'src/common/guard/role.guard';
import { Roles } from 'src/common/Decorator/Role.decorator';
import { UserRole } from 'src/common/enum';
import { Request } from 'express';

@ApiTags('barber_images')
@Controller('barber_images')
export class BarberImagesController {
  constructor(private readonly barberImagesService: BarberImagesService) {}

  @ApiOperation({
    summary: 'Create Barber_image ',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        img: { type: 'array', items: { type: 'string', format: 'binary' } },
        barber_id: { type: 'string', example: 'barber_id' },
      },
    },
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.BARBER)
  @Post()
  @UseInterceptors(FilesInterceptor('img'))
  create(
    @Body() createBarberImageDto: CreateBarberImageDto,
    @UploadedFiles() file: Express.Multer.File[],
    @Req() req: Request,
  ) {
    return this.barberImagesService.create(createBarberImageDto, file, req);
  }
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.barberImagesService.findAll();
  }

  @ApiOperation({
    summary: 'Barber Uchun',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.BARBER)
  @Get('findAllBarberImg')
  findAllBarberImg(@Req() req: Request) {
    return this.barberImagesService.findAllBarberImg(req);
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.BARBER)
  @Delete(':id')
  remove(@Param('id') id: number, @Req() req: Request) {
    return this.barberImagesService.remove(id, req);
  }
}

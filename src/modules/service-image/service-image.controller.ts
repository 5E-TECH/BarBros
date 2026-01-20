import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { ServiceImageService } from './service-image.service';
import { CreateServiceImageDto } from './dto/create-service-image.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/role.guard';
import { Roles } from 'src/common/Decorator/Role.decorator';
import { UserRole } from 'src/common/enum';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';

@Controller('service-image')
export class ServiceImageController {
  constructor(private readonly serviceImageService: ServiceImageService) {}

  @ApiOperation({ summary: 'Service uchun rasm yuklash' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        service_id: { type: 'number', example: 3 },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPPER_ADMIN, UserRole.ADMIN)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() dto: CreateServiceImageDto,
    @Req() req: Request,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.serviceImageService.create(dto, req, file);
  }

  @ApiOperation({ summary: 'Service rasmlari (public)' })
  @Get('service/:id')
  findByService(@Param('id') id: number) {
    return this.serviceImageService.findByService(Number(id));
  }

  @ApiOperation({ summary: 'Service rasmni o‘chirish' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPPER_ADMIN, UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: number, @Req() req: Request) {
    return this.serviceImageService.remove(Number(id), req);
  }
}

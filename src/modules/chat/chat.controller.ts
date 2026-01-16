import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/role.guard';
import { Roles } from 'src/common/Decorator/Role.decorator';
import { UserRole } from 'src/common/enum';
import { ApiBody, ApiConsumes, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @ApiOperation({ summary: 'Chat message yuborish' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Salom, bo‘sh vaqt bormi?' },
        user_id: { type: 'number', example: 12 },
        barber_id: { type: 'number', example: 5 },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(
    UserRole.USER,
    UserRole.BARBER,
    UserRole.SP_ADMIN,
    UserRole.ADMIN,
    UserRole.SUPPER_ADMIN,
  )
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() dto: CreateChatDto,
    @Req() req: Request,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.chatService.create(dto, req, file);
  }

  @ApiOperation({ summary: 'User-Barber chat tarixi' })
  @ApiQuery({ name: 'user_id', required: false })
  @ApiQuery({ name: 'barber_id', required: false })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(
    UserRole.USER,
    UserRole.BARBER,
    UserRole.SP_ADMIN,
    UserRole.ADMIN,
    UserRole.SUPPER_ADMIN,
  )
  @Get('conversation')
  getConversation(
    @Query('user_id') userId: string | undefined,
    @Query('barber_id') barberId: string | undefined,
    @Req() req: Request,
  ) {
    const uId = userId ? Number(userId) : undefined;
    const bId = barberId ? Number(barberId) : undefined;
    return this.chatService.getConversation(req, uId, bId);
  }

  @ApiOperation({ summary: 'Mening chatlarim' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.USER, UserRole.BARBER)
  @Get('my')
  getMy(@Req() req: Request) {
    return this.chatService.getMyChats(req);
  }
}

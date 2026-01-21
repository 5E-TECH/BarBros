import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatEntity } from './entities/chat.entity';
import { UserEntity } from 'src/modules/user/entities/user.admin,entity';
import { BarberEntity } from 'src/modules/barber/entities/barber.entity';
import { ChatGateway } from './chat.gateway';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatEntity, UserEntity, BarberEntity]),
    SubscriptionModule,
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
})
export class ChatModule {}

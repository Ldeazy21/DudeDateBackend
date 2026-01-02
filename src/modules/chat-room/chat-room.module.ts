import { Module } from '@nestjs/common';
import { ChatRoomService } from './chat-room.service';
import { ChatRoomController } from './chat-room.controller';
import { NotificationModule } from 'src/modules/notification/notification.module';

@Module({
  imports: [NotificationModule],
  controllers: [ChatRoomController],
  providers: [ChatRoomService],
})
export class ChatRoomModule {}

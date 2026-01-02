import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { UserUtils } from 'src/common/utils/user.utils';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [NotificationModule],
  controllers: [EventsController],
  providers: [EventsService, UserUtils],
  exports: [EventsService],
})
export class EventsModule {}

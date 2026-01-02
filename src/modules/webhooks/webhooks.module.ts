import { Module } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { WebhooksController } from './webhooks.controller';
import { EventsModule } from 'src/modules/events/events.module';
import { NotificationModule } from 'src/modules/notification/notification.module';
import { UserUtils } from 'src/common/utils/user.utils';

@Module({
  imports: [EventsModule, NotificationModule],
  controllers: [WebhooksController],
  providers: [WebhooksService, UserUtils],
})
export class WebhooksModule {}

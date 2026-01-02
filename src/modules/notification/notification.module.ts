import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { OneSignalModule } from 'onesignal-api-client-nest';
import { EmailNotificationService } from './email-notification.service';
import { PushNotificationService } from './push-notification.service';
import { OneSignalTemplateService } from './one-signal-template.service';
import { OneSignalConfig } from 'src/config';

@Module({
  imports: [
    OneSignalModule.forRootAsync({
      useClass: OneSignalConfig,
    }),
  ],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    EmailNotificationService,
    PushNotificationService,
    OneSignalTemplateService,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}

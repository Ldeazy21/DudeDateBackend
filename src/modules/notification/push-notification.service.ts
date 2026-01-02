import { Injectable, Logger } from '@nestjs/common';
import { OneSignalService } from 'onesignal-api-client-nest';
import { NotificationByDeviceBuilder } from 'onesignal-api-client-core';
import { NotificationPayloadDto, NotificationType } from './dto';
@Injectable()
export class PushNotificationService {
  constructor(private readonly oneSignalService: OneSignalService) {}

  logger: Logger = new Logger(PushNotificationService.name);

  async sendPushNotification(payload: NotificationPayloadDto) {
    try {
      const type = payload.type || NotificationType.GENERAL;

      const input = new NotificationByDeviceBuilder()
        .setIncludeExternalUserIds(payload.user_ids)
        .notification()
        .setHeadings({ en: payload.title })
        .setContents({ en: payload.content })
        .setContentAvailable(payload.content !== null)
        .setPlatform({
          isIos: true,
          isAndroid: true,
          isAnyWeb: true,
        })
        .setAppearance({
          ios_badgeCount: +1,
          apns_alert: {
            body: payload.content,
          },
        })
        .setAttachments({
          data: payload.data,
        })
        .build();

      const resutl = await this.oneSignalService.createNotification(input);
    } catch (error) {
      console.log(error.response.data);
      this.logger.error('Exception Sending Notification: ', error.message);
    }
  }
}

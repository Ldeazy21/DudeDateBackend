import { Injectable } from '@nestjs/common';
import { EventStatus, NotificationType } from '@prisma/client';
import dayjs from 'dayjs';
import { UserUtils } from 'src/common/utils/user.utils';
import { UpdateEventDto } from 'src/modules/events/dto';
import {
  EventsService,
  SendEventEmail,
} from 'src/modules/events/events.service';
import { NotificationPayloadDto } from 'src/modules/notification/dto';
import { NotificationInterface } from 'src/modules/notification/interface';
import { NotificationService } from 'src/modules/notification/notification.service';

@Injectable()
export class WebhooksService {
  constructor(
    private readonly eventService: EventsService,
    private readonly notificationService: NotificationService,
    private readonly userUtils: UserUtils,
  ) {}

  async updateEventStatus(body: Record<string, any>) {
    try {
      const user_id: string = body.data.object.metadata.user_id;
      const event_id: string = body.data.object.metadata.event_id;
      const event_title: string = body.data.object.metadata.event_title;
      const notify_all_team: string = body.data.object.metadata.notify_all_team;

      let send_notification_payload: NotificationPayloadDto;
      let create_notification_payload: NotificationInterface;
      let title: string;
      let content: string;

      if (body.data.object.status === 'succeeded') {
        const event_update_data: UpdateEventDto = {
          status: EventStatus.PAID,
        };

        const event_id: string = body.data.object.metadata.event_id;

        const event = await this.eventService.update(
          user_id,
          event_id,
          event_update_data,
        );

        title = `Payment Successful for ${event_title}`;
        content = `Your payment for the event "${event_title}" has been successfully processed.`;

        create_notification_payload = {
          type: NotificationType.EVENT,
          title,
          event_id,
          message: content,
          user_id,
        };

        send_notification_payload = {
          user_ids: [user_id],
          title,
          content,
        };

        const email_payload: SendEventEmail = {
          email: event.user.email,
          subject: `🎉 Your event "${event.title}" has been created!`,
          template: 'event-created',
          user_name: event.user.user_name,
          event_title: event.title,
          event_date: dayjs(event.start_date).format('YYYY:MM:DD'),
          event_time: dayjs(event.start_time).format('hh:mm A'),
          event_location: event.address,
          event_type: event.type,
          event_fee:
            event.event_fee === 'FREE' ? 'Free' : `$${event.event_fee}`,
        };
        await Promise.all([
          this.notificationService.createNotification(
            create_notification_payload,
          ),

          this.notificationService.sendNotification(send_notification_payload),
          this.notificationService.sendEmail(email_payload),
        ]);
        if (notify_all_team === 'true') {
          await this.userUtils.notifyAllTeamMembers(event.user, event);
        }

        return { status: true, message: 'Payment successful' };
      }

      // ---- Payment Failed ----
      title = `Payment Failed for ${event_title}`;
      content = `Unfortunately, your payment for the event "${event_title}" could not be processed. Please try again.`;

      send_notification_payload = {
        user_ids: [user_id],
        title,
        content,
      };

      create_notification_payload = {
        type: NotificationType.EVENT,
        title,
        event_id,
        message: content,
        user_id,
      };

      await this.notificationService.createNotification(
        create_notification_payload,
      );

      await this.notificationService.sendNotification(
        send_notification_payload,
      );

      return { success: false, message: 'Payment failed' };
    } catch (error) {
      throw error;
    }
  }
}

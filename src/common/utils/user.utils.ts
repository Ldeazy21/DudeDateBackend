import { Injectable } from '@nestjs/common';
import { Event, NotificationType, Otp, User } from '@prisma/client';
import { randomInt } from 'crypto';
import dayjs from 'dayjs';
import { PrismaService } from 'src/database/prisma.service';
import { NotificationPayloadDto } from 'src/modules/notification/dto';
import { NotificationService } from 'src/modules/notification/notification.service';

@Injectable()
export class UserUtils {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}
  generateSixDigitCode() {
    return randomInt(0, 999999).toString().padStart(6, '0');
  }

  generateExpirationTime() {
    return dayjs().add(1, 'minute').toDate().toISOString();
  }

  extractOTPDataFromPayload(data: Otp) {
    const {
      code,
      is_used,
      created_at,
      is_verified,
      expire_at,
      updated_at,
      ...otpData
    } = data;

    return otpData;
  }
  async notifyAllTeamMembers(user: User, event: Event) {
    const existing_user = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: {
        team: {
          where: { is_deleted: false },
          select: {
            owner_id: true,
            team_members: {
              where: { is_removed: false },
              select: { user_id: true },
            },
          },
        },
        team_members: {
          where: { is_removed: false },
          select: {
            team: {
              select: {
                owner_id: true,
                team_members: {
                  where: { is_removed: false },
                },
              },
            },
          },
        },
      },
    });

    if (
      existing_user.team.length === 0 &&
      existing_user.team_members.length === 0
    ) {
      return;
    }

    const team_member_ids = new Set<string>();

    // Teams owned by the user
    for (const team of existing_user.team) {
      for (const member of team.team_members) {
        team_member_ids.add(member.user_id);
      }
      team_member_ids.add(team.owner_id);
    }

    // Teams the user is a member of
    for (const member of existing_user.team_members) {
      for (const teammate of member.team.team_members) {
        team_member_ids.add(teammate.user_id);
      }
      team_member_ids.add(member.team.owner_id);
    }

    // Exclude the event creator

    team_member_ids.delete(user.id);

    const notify_user_ids = Array.from(team_member_ids);

    if (notify_user_ids.length === 0) return;

    const title = `New Event Created: ${event.title}`;
    const content = `${user.user_name} has created a new event "${event.title}".`;

    const notifications = notify_user_ids.map((userId) => ({
      type: NotificationType.EVENT,
      title,
      message: content,
      event_id: event.id,
      sender_id: user.id,
      user_id: userId,
      is_read: false,
    }));

    await this.prisma.notification.createMany({
      data: notifications,
    });

    // === 2️⃣ Send Real-Time Notifications (optional) ===
    const send_notification_payload: NotificationPayloadDto = {
      user_ids: notify_user_ids,
      title,
      content: content,
    };

    await this.notificationService.sendNotification(send_notification_payload);
  }
}

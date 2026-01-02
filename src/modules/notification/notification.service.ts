import { Injectable } from '@nestjs/common';
import {
  CreateManyNotificationDto,
  CreateNotificationDto,
  NotificationPayloadDto,
  NotificationType,
} from './dto';
import { EmailNotificationService } from './email-notification.service';
import { PushNotificationService } from './push-notification.service';
import { PrismaService } from 'src/database/prisma.service';
import { getTakeAndSkip, PaginationRequest } from 'src/common/dtos';
import { EmailNotificationInterface } from './interface';

@Injectable()
export class NotificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailNotificationService: EmailNotificationService,
    private readonly pushNotification: PushNotificationService,
  ) {}

  async createNotification(body: CreateNotificationDto) {
    try {
      return await this.prisma.notification.create({ data: body });
    } catch (error) {
      throw error;
    }
  }

  async createManyNotification(body: CreateManyNotificationDto[]) {
    try {
      return await this.prisma.notification.createMany({
        data: body,
      });
    } catch (error) {
      throw error;
    }
  }

  async getUserNotifications(user_id: string, query: PaginationRequest) {
    try {
      const { take, skip } = getTakeAndSkip(query.page, query.size);
      const [notifictions, total_records] = await Promise.all([
        this.prisma.notification.findMany({
          where: {
            user_id,
          },
          include: {
            team: {
              select: {
                id: true,
                name: true,
                logo_url: true,
              },
            },
            team_invitation: {
              select: {
                id: true,
              },
            },

            event: {
              select: {
                id: true,
                img_url: true,
              },
            },
            match_schedule: {
              select: {
                id: true,
              },
            },
            anncouncement: {
              select: {
                id: true,
              },
            },
          },
          take,
          skip,
          orderBy: {
            created_at: 'desc',
          },
        }),
        this.prisma.notification.count({ where: { user_id } }),
      ]);

      const total_pages = Math.ceil(total_records / take);

      return {
        data: notifictions,
        pagination: {
          current_page: +query.page,
          page_size: take,
          total_pages,
          total_records,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async getUserUnreadNotifications(user_id: string) {
    try {
      const notifications = await this.prisma.$queryRawUnsafe(
        `SELECT COUNT(*) FROM "notifications" WHERE user_id = $1 AND is_read = false`,
        user_id,
      );

      const count = Number(notifications[0].count);
      return { count };
    } catch (error) {
      throw error;
    }
  }

  async markAllNotificationsAsRead(user_id: string) {
    try {
      return await this.prisma.notification.updateMany({
        where: {
          user_id,
          is_read: false,
        },
        data: {
          is_read: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async sendEmail(paylaod: EmailNotificationInterface) {
    return await this.emailNotificationService.sendEmail(paylaod);
  }

  async sendNotification(paylaod: NotificationPayloadDto) {
    const notificationPayload: NotificationPayloadDto = {
      user_ids: paylaod.user_ids,
      title: paylaod.title || 'Dawg Pound',
      subtitle: paylaod.subtitle || 'Dawg Pound',
      content: paylaod.content,
      type: paylaod.type || NotificationType.GENERAL,
      data: {
        email: paylaod.data?.sender_info?.email,
        phone: paylaod.data?.sender_info?.phone,
        team_logo_url: paylaod?.data?.team_logo_url,
      },
    };

    return await this.pushNotification.sendPushNotification(
      notificationPayload,
    );
  }
}

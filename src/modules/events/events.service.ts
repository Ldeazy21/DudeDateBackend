import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import {
  CreateEventDto,
  EventTimeRange,
  GetAllEventsQueryDto,
  GetPublicEventDto,
  GetUserAllEventsQueryDto,
  UpdateEventDto,
} from './dto';
import dayjs from 'dayjs';
import { getTakeAndSkip, PaginationRequest } from 'src/common/dtos';
import {
  EventStatus,
  EventType,
  NotificationType,
  Prisma,
  User,
} from '@prisma/client';
import { NotificationPayloadDto } from '../notification/dto';
import { NotificationInterface } from '../notification/interface';
import { NotificationService } from '../notification/notification.service';
import utc from 'dayjs/plugin/utc';
import { UserUtils } from 'src/common/utils/user.utils';
dayjs.extend(utc);

export interface SendEventEmail {
  email: string;
  subject: string;
  user_name: string;
  event_title: string;
  event_date: string | Date;
  event_time: string | Date;
  event_location: string;
  event_fee?: string;
  event_type?: EventType;
  template: string;
}
@Injectable()
export class EventsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
    private readonly userUtils: UserUtils,
  ) {}

  async create(user: User, body: CreateEventDto) {
    try {
      // if (body.event_fee !== 'FREE') {
      //   if (!body.payment_detail && !body.ticket_purchase_url) {
      //     throw new BadRequestException(
      //       'Payments details and ticket purchase link are missing',
      //     );
      //   }
      // }
      const { notify_all_team, ...new_data } = body;
      const event = await this.prisma.event.create({
        data: {
          user_id: user.id,
          ...new_data,
        },
      });

      if (body.event_fee === 'FREE') {
        const title = `Event Created Successfully: ${event.title}`;
        const content = `Your event "${event.title}" has been created successfully and is now live.`;

        const create_notification_payload: NotificationInterface = {
          type: NotificationType.EVENT,
          title,
          event_id: event.id,
          message: content,
          user_id: user.id,
        };

        const send_notification_payload: NotificationPayloadDto = {
          user_ids: [user.id],
          title,
          content,
        };

        const email_payload: SendEventEmail = {
          email: user.email,
          subject: `🎉 Your event "${event.title}" has been created!`,
          template: 'event-created',
          user_name: user.user_name,
          event_title: event.title,
          event_date: dayjs(event.start_date).format('YYYY:MM:DD'),
          event_time: dayjs(event.start_time).format('hh:mm A'),
          event_location: event.address,
          event_type: event.type,
          // event_fee:
          //   event.event_fee === 'FREE' ? 'Free' : `$${event.event_fee}`,
        };

        await Promise.all([
          this.notificationService.createNotification(
            create_notification_payload,
          ),
          this.notificationService.sendNotification(send_notification_payload),
          this.notificationService.sendEmail(email_payload),
        ]);
        if (body.notify_all_team === true) {
          await this.userUtils.notifyAllTeamMembers(user, event);
        }
      }

      return {
        message: 'Event create successfully.',
        data: event,
      };
    } catch (error) {
      throw error;
    }
  }

  async getUserAllEvents(user_id: string, query: GetUserAllEventsQueryDto) {
    try {
      const { take, skip } = getTakeAndSkip(query.page, query.size);
      const now = dayjs.utc().toDate(); // current UTC time

      let where_clause: Prisma.EventFindManyArgs = {
        where: {
          user_id,
          OR: [{ is_free: true }, { status: EventStatus.PAID, is_free: false }],
        },
        orderBy: { start_time: 'asc' },
        take,
        skip,
      };

      if (query.time_range === EventTimeRange.PAST) {
        where_clause = {
          ...where_clause,
          where: {
            ...where_clause.where,
            end_time: { lt: now },
          },
          orderBy: { end_time: 'desc' },
        };
      } else if (query.time_range === EventTimeRange.UPCOMING) {
        where_clause = {
          ...where_clause,
          where: {
            ...where_clause.where,
            start_time: { gt: now },
          },
          orderBy: { start_time: 'asc' },
        };
      } else if (query.time_range === EventTimeRange.ON_GOING) {
        where_clause = {
          ...where_clause,
          where: {
            ...where_clause.where,
            start_time: { lte: now },
            end_time: { gte: now },
          },
          orderBy: { start_time: 'asc' },
        };
      } else {
        where_clause = {
          ...where_clause,
          orderBy: { end_time: 'asc' },
        };
      }

      const [events, total_records] = await Promise.all([
        this.prisma.event.findMany(where_clause),
        this.prisma.event.count({ where: where_clause.where }),
      ]);

      const total_pages = Math.ceil(total_records / take);

      const data = events.map((event) => ({
        ...event,
        is_my_event: event.user_id === user_id,
      }));

      return {
        data,
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

  async update(user_id: string, id: string, body: UpdateEventDto) {
    try {
      return await this.prisma.event.update({
        where: {
          id,
          user_id,
        },
        data: {
          ...body,
        },
        include: {
          user: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Event not found');
        }
      }
      throw error;
    }
  }

  async getById(user_id: string, id: string) {
    try {
      const event = await this.prisma.event.findUnique({ where: { id } });
      return {
        ...event,
        is_my_event: event.user_id === user_id,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Event not found');
        }
      }
      throw error;
    }
  }

  async getAllEvents(user: any, query: GetAllEventsQueryDto) {
    try {
      const { take, skip } = getTakeAndSkip(query.page, query.size);

      let where_clause: Prisma.EventFindManyArgs = {
        where: {
          type: EventType.PUBLIC,
          OR: [
            { is_free: true },
            {
              status: EventStatus.PAID,
              is_free: false,
            },
          ],
        },
      };

      let search_clause: Prisma.EventWhereInput = query.search
        ? {
            title: {
              contains: query.search,
              mode: 'insensitive',
            },
          }
        : {};
      if (user.team.length === 0 && user.team_members.length === 0) {
        if (query.search) {
          const events = await this.prisma.event.findMany({
            where: {
              ...where_clause.where,
              ...search_clause,
            },
          });
          return { data: events };
        }
      }

      if (user.team_members.length !== 0) {
        const team_id = user.team_members
          .map((team) => {
            return team.team_id;
          })
          .toString();

        const teams = await this.prisma.team.findMany({
          where: { id: team_id, is_deleted: false },
          include: {
            team_members: {
              where: {
                is_removed: false,
              },
            },
          },
        });

        let team_members_ids: string[] = [];

        for (const team of teams) {
          if (team.owner_id && team.owner_id !== user.id) {
            team_members_ids.push(team.owner_id);
          }

          for (const member of team.team_members) {
            if (member.user_id !== user.id) {
              team_members_ids.push(member.user_id);
            }
          }
        }

        where_clause = {
          where: {
            OR: [
              {
                type: EventType.PUBLIC,

                OR: [
                  { is_free: true },
                  {
                    status: EventStatus.PAID,
                    is_free: false,
                  },
                ],
              },

              {
                type: {
                  in: [EventType.PUBLIC, EventType.PRIVATE],
                },
                user_id: {
                  in: team_members_ids,
                },
                OR: [
                  { is_free: true },
                  {
                    status: EventStatus.PAID,
                    is_free: false,
                  },
                ],
              },
            ],
            ...search_clause,
          },
        };
      }
      if (user.team.length !== 0) {
        const teams = await this.prisma.team.findMany({
          where: {
            owner_id: user.id,
            is_deleted: false,
          },
          include: {
            team_members: {
              where: {
                is_removed: false,
              },
            },
          },
        });

        const team_members_ids: string[] = [];

        for (const team of teams) {
          if (team.team_members && team.team_members.length > 0) {
            for (const member of team.team_members) {
              if (member.user_id !== user.id) {
                team_members_ids.push(member.user_id);
              }
            }
          }
        }

        where_clause = {
          where: {
            OR: [
              {
                type: EventType.PUBLIC,
                OR: [
                  { is_free: true },
                  {
                    status: EventStatus.PAID,
                    is_free: false,
                  },
                ],
              },
              {
                type: {
                  in: [EventType.PUBLIC, EventType.PRIVATE],
                },
                user_id: {
                  in: team_members_ids,
                },
                is_free: true,
                OR: [
                  { is_free: true },
                  {
                    status: EventStatus.PAID,
                    is_free: false,
                  },
                ],
              },
            ],
            ...search_clause,
          },
          orderBy: {
            updated_at: 'desc',
          },
        };
      }

      const [events, total_records] = await Promise.all([
        this.prisma.event.findMany({
          where: { ...where_clause.where },
          take,
          skip,
          orderBy: { updated_at: 'desc' },
        }),

        this.prisma.event.count({ where: { ...where_clause.where } }),
      ]);

      const data = events.map((event) => ({
        ...event,
        is_my_event: event.user_id === user.id,
      }));

      const total_pages = Math.ceil(total_records / take);

      return {
        data,
        pagination: {
          current_page: Number(query.page),
          page_size: take,
          total_pages,
          total_records,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async getPublicEvents(query: GetPublicEventDto) {
    try {
      const { take, skip } = getTakeAndSkip(query.page, query.size);
      let search_clause: Prisma.EventWhereInput;
      if (query.search) {
        search_clause = query.search
          ? {
              title: {
                contains: query.search,
                mode: 'insensitive',
              },
            }
          : {};
      }
      const [events, total_records] = await Promise.all([
        this.prisma.event.findMany({
          where: {
            type: EventType.PUBLIC,
            ...search_clause,
          },
          take,
          skip,
          orderBy: {
            updated_at: 'desc',
          },
        }),
        this.prisma.event.count({
          where: { type: EventType.PUBLIC, ...search_clause },
        }),
      ]);

      const total_pages = Math.ceil(total_records / take);
      return {
        data: events,
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

  async sendEventReminders() {
    try {
      const tomorrowStart = dayjs.utc().add(1, 'day').startOf('day');
      const tomorrowEnd = dayjs.utc().add(1, 'day').endOf('day');

      const events = await this.prisma.event.findMany({
        where: {
          start_date: {
            gte: tomorrowStart.toDate(),
            lte: tomorrowEnd.toDate(),
          },
        },
        include: {
          user: {
            select: {
              email: true,
              user_name: true,
            },
          },
        },
      });

      await Promise.all(
        events.map(async (event) => {
          const { user } = event;
          if (!user?.email) return;

          const email_payload: SendEventEmail = {
            email: user.email,
            subject: `Reminder: Your event "${event.title}" starts tomorrow!`,
            template: 'event-reminder',
            user_name: user.user_name,
            event_title: event.title,
            event_date: dayjs(event.start_date).format('YYYY:MM:DD'),
            event_time: dayjs(event.start_time).format('hh:mm A'),
            event_location: event.address,
          };

          console.log(
            `📧 Sending reminder to ${user.email} for ${event.title}`,
          );
          await this.notificationService.sendEmail(email_payload);
        }),
      );

      return;
    } catch (error) {
      throw error;
    }
  }
}

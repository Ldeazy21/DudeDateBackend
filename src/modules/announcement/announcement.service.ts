import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateAnnouncementDto, GetUserAllAnnouncementQueryDto } from './dto';
import { NotificationType, Prisma, Role } from '@prisma/client';
import { TeamsService } from 'src/modules/teams/teams.service';
import { NotificationInterface } from 'src/modules/notification/interface';
import { NotificationService } from 'src/modules/notification/notification.service';
import { getTakeAndSkip } from 'src/common/dtos/pagination.dto';
import { UserInterface } from 'src/modules/user/interface';
import { NotificationPayloadDto } from '../notification/dto';

interface TeamMemberAssignment {
  team_id: string;
  team_member_id: string;
}
@Injectable()
export class AnnouncementService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly teamService: TeamsService,
    private readonly notificationService: NotificationService,
  ) {}

  async create(user_id: string, body: CreateAnnouncementDto) {
    try {
      let { subject, description, team_ids } = body;
      let notification_payload: NotificationInterface[] = [];
      let assigned_team_members: TeamMemberAssignment[] = [];

      if (body.notify_all_team === true) {
        const teams = await this.teamService.listUserTeams(user_id);
        team_ids = teams.map((team) => ({ team_id: team.id }));
      }

      for (const team of team_ids) {
        const team_member_result =
          await this.teamService.listTeamMembersByTeamId(team.team_id);

        const teamAssignments: TeamMemberAssignment[] =
          team_member_result.team_members.map((member) => ({
            team_id: member.team_id,
            team_member_id: member.user_id,
          }));

        assigned_team_members.push(...teamAssignments);
      }

      const annoucement = await this.prisma.announcement.create({
        data: {
          subject,
          description,
          user_id,
          teams: {
            connect: [...team_ids.map((team) => ({ id: team.team_id }))],
          },
        },
      });

      let title: string = '📢 New Announcement Alert!';
      let content: string =
        'A new announcement has been posted. Please review the details.';

      for (const team_member of assigned_team_members) {
        notification_payload.push({
          title,
          message: content,
          sender_id: user_id,
          user_id: team_member.team_member_id,
          annoucement_id: annoucement.id,
          type: NotificationType.ANNOUCEMENT,
          team_id: team_member.team_id,
        });
      }
      const notify_all_team_members = assigned_team_members.map(
        (team_member) => {
          return team_member.team_member_id;
        },
      );

      const send_notifiaction_payload: NotificationPayloadDto = {
        user_ids: [notify_all_team_members].flat(),
        title,
        content,
      };

      await Promise.all([
        await this.notificationService.createManyNotification(
          notification_payload,
        ),
        await this.notificationService.sendNotification(
          send_notifiaction_payload,
        ),
      ]);

      return {
        message: 'Annoucement create successfully',
        data: annoucement,
      };
    } catch (error) {
      throw error;
    }
  }

  async getUserAnnouncements(
    user: UserInterface,
    query: GetUserAllAnnouncementQueryDto,
  ) {
    try {
      const { take, skip } = getTakeAndSkip(query.page, query.size);
      const base_where_clause: Prisma.AnnouncementWhereInput = query.search
        ? {
            subject: {
              contains: query.search,
              mode: 'insensitive',
            },
          }
        : {};

      let announcement_where_clause: Prisma.AnnouncementWhereInput = {};
      const team_select = {
        id: true,
        name: true,
        logo_url: true,
        type: true,
      };

      if (user.role === Role.TEAM_OWNER) {
        announcement_where_clause = {
          ...base_where_clause,
          teams: {
            every: {
              owner_id: user.id,
              is_deleted: false,
            },
          },
        };
      } else if (user.role === Role.USER) {
        announcement_where_clause = {
          ...base_where_clause,
          teams: {
            some: {
              is_deleted: false,
              team_members: {
                some: {
                  user_id: user.id,
                },
              },
            },
          },
        };
      }

      const [announcements, total_records] = await Promise.all([
        this.prisma.announcement.findMany({
          where: announcement_where_clause,
          include: {
            teams: {
              select: team_select,
            },
          },
          take,
          skip,
          orderBy: {
            created_at: 'desc',
          },
        }),
        this.prisma.announcement.count({ where: announcement_where_clause }),
      ]);

      const total_pages = Math.ceil(total_records / take);

      const data =
        user.role === Role.USER
          ? announcements.map((announcement) => {
              const {
                id,
                user_id,
                subject,
                description,
                created_at,
                updated_at,
              } = announcement;
              const userTeamId = user.team_members?.[0]?.team_id;
              return {
                id,
                subject,
                description,
                user_id,
                created_at,
                updated_at,
                team: announcement.teams.find((team) => team.id === userTeamId),
              };
            })
          : announcements;

      return {
        data,
        pagination: {
          current_page: query.page,
          page_size: take,
          total_pages,
          total_records,
        },
      };
    } catch (error) {
      throw error;
    }
  }
}

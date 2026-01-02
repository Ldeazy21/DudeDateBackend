import {
  ForbiddenException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateMatchScheduleDto, GetAllMatchScheduleQueryDto } from './dto';
import { TeamsService } from 'src/modules/teams/teams.service';
import { getTakeAndSkip } from 'src/common/dtos/pagination.dto';
import { Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import { NotificationService } from 'src/modules/notification/notification.service';
import { NotificationInterface } from 'src/modules/notification/interface';
import {
  NotificationPayloadDto,
  NotificationType,
} from 'src/modules/notification/dto';

@Injectable()
export class MatchScheduleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly teamsService: TeamsService,
    private readonly notificationService: NotificationService,
  ) {}

  async create(user_id: string, body: CreateMatchScheduleDto) {
    try {
      const [first_team, second_team] = await Promise.all([
        this.teamsService.getUserTeamById(user_id, body.first_team_id),
        this.teamsService.getUserTeamById(user_id, body.second_team_id),
      ]);

      if (
        !first_team ||
        first_team.length === 0 ||
        !second_team ||
        second_team.length === 0
      ) {
        throw new NotFoundException('Team not found');
      }

      if (
        !body.match_schedule_first_team_member_ids ||
        !body.match_schedule_second_team_members_ids
      ) {
        throw new NotFoundException('Team member not found');
      }

      if (
        body.match_schedule_first_team_member_ids.length !==
        body.match_schedule_second_team_members_ids.length
      ) {
        throw new NotAcceptableException(
          'Please select same number of players for both teams',
        );
      }

      const {
        match_schedule_first_team_member_ids,
        match_schedule_second_team_members_ids,
        ...rest
      } = body;

      const first_team_name: string = first_team[0].name;
      const second_team_name: string = second_team[0].name;

      const title = `${first_team_name} vs ${second_team_name} - Match Scheduled`;
      const content = `A match between ${first_team_name} and ${second_team_name} has been scheduled. Please check the schedule for details.`;

      const match_schedule = await this.prisma.$transaction(async (tx) => {
        const match_schedule = await tx.matchSchedule.create({
          data: {
            ...rest,
          },
        });

        await tx.matchScheduleTeamMember.create({
          data: {
            match_schedule_id: match_schedule.id,
            first_team_members: {
              connect: [
                ...body.match_schedule_first_team_member_ids.map((id) => ({
                  id: id.team_member_id,
                })),
              ],
            },
            second_team_members: {
              connect: [
                ...body.match_schedule_second_team_members_ids.map((id) => ({
                  id: id.team_member_id,
                })),
              ],
            },
          },
        });

        return match_schedule;
      });
      const first_team_user_ids = match_schedule_first_team_member_ids.map(
        (member) => member.user_id,
      );
      const second_team_members_ids =
        match_schedule_second_team_members_ids.map((member) => member.user_id);

      let notification_payload: NotificationInterface[] = [];

      for (const first_team_user_id of first_team_user_ids) {
        notification_payload.push({
          title,
          message: content,
          team_id: body.first_team_id,
          type: NotificationType.MATCH_SCHEDULE,
          sender_id: user_id,
          match_schedule_id: match_schedule.id,
          user_id: first_team_user_id,
        });
      }

      for (const match_schedule_second_team_members_id of second_team_members_ids) {
        notification_payload.push({
          title,
          message: content,
          team_id: body.second_team_id,
          type: NotificationType.MATCH_SCHEDULE,
          sender_id: user_id,
          match_schedule_id: match_schedule.id,
          user_id: match_schedule_second_team_members_id,
        });
      }

      await this.notificationService.createManyNotification(
        notification_payload,
      );

      const send_notifiaction_payload: NotificationPayloadDto = {
        user_ids: [first_team_user_ids, second_team_members_ids].flat(),
        title,
        content,
        type: NotificationType.MATCH_SCHEDULE,
      };
      await this.notificationService.sendNotification(
        send_notifiaction_payload,
      );
      return {
        message: 'Match Scheduled Successfully',
        data: match_schedule,
      };
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string) {
    try {
      const match_schedule = await this.prisma.matchSchedule.findUnique({
        where: { id },
        include: {
          match_result: true,
          first_team: {
            select: {
              id: true,
              name: true,
            },
          },
          second_team: {
            select: {
              id: true,
              name: true,
            },
          },
          match_schedule_team_members: {
            include: {
              first_team_members: {
                select: {
                  id: true,
                  team_id: true,
                  team_member_role: true,
                  is_removed: true,
                  user_id: true,
                  user: {
                    select: {
                      id: true,
                      user_name: true,
                      profile_picture_url: true,
                    },
                  },
                },
              },
              second_team_members: {
                select: {
                  id: true,
                  team_id: true,
                  team_member_role: true,
                  is_removed: true,
                  user_id: true,
                  user: {
                    select: {
                      id: true,
                      user_name: true,
                      profile_picture_url: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!match_schedule) {
        throw new NotFoundException('Not found');
      }

      const { match_result, ...rest } = match_schedule;

      return {
        data: {
          ...rest,
          is_match_result_created: !!match_result,
        },
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Not found');
      }
      throw error;
    }
  }

  async getMatchSchedulesByTeamId(
    team_id: string,
    query: GetAllMatchScheduleQueryDto,
  ) {
    try {
      let { take, skip } = getTakeAndSkip(query.page, query.size);

      if (!take || !skip) {
        take = 10;
        skip = 0;
      }

      const match_schedules = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT 
        ms.*, 
        json_build_object(
          'id', ft.id,
          'name', ft.name,
          'type', ft.type,
          'description', ft.description,
          'logo_url', ft.logo_url,
          'owner_id', ft.owner_id,
          'is_deleted', ft.is_deleted,
          'created_at', ft.created_at,
          'updated_at', ft.updated_at
        ) AS first_team,
        json_build_object(
          'id', st.id,
          'name', st.name,
          'type', st.type,
          'description', st.description,
          'logo_url', st.logo_url,
          'owner_id', st.owner_id,
          'is_deleted', st.is_deleted,
          'created_at', st.created_at,
          'updated_at', st.updated_at
        ) AS second_team
      FROM "match_schedule" ms
      LEFT JOIN "teams" ft ON ms.first_team_id = ft.id
      LEFT JOIN "teams" st ON ms.second_team_id = st.id
      WHERE ms.first_team_id = '${team_id}' OR ms.second_team_id = '${team_id}'
      ORDER BY ms.updated_at DESC
      LIMIT ${take}
      OFFSET ${skip};
    `);
      const total_count = await this.prisma.$queryRawUnsafe(
        `SELECT COUNT(*) FROM "match_schedule" 
   WHERE first_team_id = $1 OR second_team_id = $1`,
        team_id,
      );

      const total_records = Number(total_count[0].count);
      const total_pages = Math.ceil(total_records / take);
      return {
        data: match_schedules,
        pagination: {
          current_page: +query.page ? +query.page : 1,
          page_size: take,
          total_pages,
          total_records,
        },
      };
    } catch (error) {
      throw error;
    }
  }
  async deleteMachSchedule(id: string) {
    try {
      return await this.prisma.matchSchedule.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Match Schedule not found');
      }
      throw error;
    }
  }

  async recreateMatchSchedule(
    user_id: string,
    id: string,
    body: CreateMatchScheduleDto,
  ) {
    try {
      const existing_match_schedule =
        await this.prisma.matchSchedule.findUnique({ where: { id } });

      const current_datetime = dayjs().toDate();

      if (current_datetime >= existing_match_schedule.start_date) {
        throw new ForbiddenException(
          'Your are not allow to update the match scdeule',
        );
      }
      await this.prisma.matchSchedule.delete({
        where: {
          id,
        },
      });

      return await this.create(user_id, body);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Match Schedule not found');
      }
      throw error;
    }
  }
}

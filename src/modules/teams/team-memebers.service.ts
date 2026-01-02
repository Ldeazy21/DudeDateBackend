import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateTeamMemberDto, UpdateTeamMemberDto } from './dto';
import { getTakeAndSkip, PaginationRequest } from 'src/common/dtos';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { NotificationService } from 'src/modules/notification/notification.service';
import { NotificationPayloadDto } from 'src/modules/notification/dto';
import { TeamMemberRole } from '@prisma/client';
import { TeamsService } from './teams.service';

@Injectable()
export class TeamMembersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
    private readonly teamService: TeamsService,
  ) {}

  async create(body: CreateTeamMemberDto) {
    try {
      await this.prisma.teamMember.create({
        data: {
          ...body,
        },
        include: {
          team: true,
        },
      });
      return { message: 'Team member invite request sent successfully' };
    } catch (error) {
      throw error;
    }
  }

  async updateTeamMember(id: string, body: UpdateTeamMemberDto) {
    try {
      return await this.prisma.teamMember.update({
        where: {
          id,
        },
        data: {
          ...body,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Not found');
        }
      }
      throw error;
    }
  }

  async getTeamMembersByTeamId(team_id: string, query: PaginationRequest) {
    try {
      const { take, skip } = getTakeAndSkip(query.page, query.size);
      const [members, total_records] = await Promise.all([
        this.prisma.teamMember.findMany({
          where: {
            team_id,
          },
          include: {
            user: true,
          },
          take,
          skip,
        }),

        this.prisma.teamMember.count({
          where: {
            team_id,
          },
        }),
      ]);
      const total_pages = Math.ceil(total_records / take);
      return {
        data: members,
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

  async removeTeamMember(id: string) {
    try {
      const team_member = await this.prisma.teamMember.update({
        where: { id },
        data: {
          is_removed: true,
        },
        include: { team: true },
      });

      const send_notifiaction_payload: NotificationPayloadDto = {
        title: 'Removed from Team',
        user_ids: [team_member.user_id],
        content: `You have been removed from the team ${team_member.team.name.toUpperCase()}.`,
      };
      await this.notificationService.sendNotification(
        send_notifiaction_payload,
      );
      return { message: 'Team member remove successfully' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Not found');
      }
    }
  }

  async getRemovedTeamMember(team_id: string, user_id: string) {
    try {
      return await this.prisma.teamMember.findFirst({
        where: {
          team_id,
          user_id,
          is_removed: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async updateTeamMemberRole(
    team_id: string,
    team_member_id: string,
    team_member_role: TeamMemberRole,
  ) {
    try {
      const existing_team_member =
        await this.teamService.listTeamMembersByTeamId(team_id);

      const has_captain = existing_team_member.team_members.some(
        (team_member) =>
          team_member.team_member_role === TeamMemberRole.CAPTAIN,
      );

      if (has_captain && team_member_role === TeamMemberRole.CAPTAIN) {
        throw new ForbiddenException('You already have a team captain');
      }

      return await this.prisma.teamMember.update({
        where: {
          id: team_member_id,
        },
        data: {
          team_member_role,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Not found');
        }
      }
      throw error;
    }
  }
}

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/database/prisma.service';
import { CreateMatchAttendanceDto, CreateMatchResultDto } from './dto';
import { AttendanceStatus, Prisma } from '@prisma/client';

@Injectable()
export class MatchResultService {
  constructor(private readonly prisma: PrismaService) {}

  private mapTeamMembersToCreateManyData(
    teamMembers: CreateMatchAttendanceDto[],
    match_result_id: string,
    status?: AttendanceStatus,
  ): {
    match_result_id: string;
    first_team_member_id: string;
    second_team_member_id: string;
    status?: AttendanceStatus;
  }[] {
    return teamMembers.map((member) => ({
      match_result_id,
      first_team_member_id: member.first_team_member_id,
      second_team_member_id: member.second_team_member_id,
      status: member.status,
    }));
  }

  async create(body: CreateMatchResultDto) {
    try {
      const match_result = await this.prisma.$transaction(async (tx) => {
        const {
          top_performer_first_team_members_ids,
          top_performer_second_team_members_ids,
          match_attendance_first_team_members_ids,
          match_attendance_second_team_members_ids,
          ...match_result_data
        } = body;
        const match_result = await tx.matchResult.create({
          data: match_result_data,
        });
        if (
          body.top_performer_first_team_members_ids ||
          body.top_performer_second_team_members_ids
        ) {
          await tx.topPerformer.create({
            data: {
              match_result_id: match_result.id,
              first_team_members: body.top_performer_first_team_members_ids
                ? {
                    connect: [
                      ...body.top_performer_first_team_members_ids.map(
                        (id) => ({
                          id: id.team_member_id,
                        }),
                      ),
                    ],
                  }
                : {},
              second_team_members: body.top_performer_second_team_members_ids
                ? {
                    connect: [
                      ...body.top_performer_second_team_members_ids.map(
                        (id) => ({
                          id: id.team_member_id,
                        }),
                      ),
                    ],
                  }
                : {},
            },
          });
        }
        if (body.match_attendance_first_team_members_ids) {
          await tx.matchAttendance.createMany({
            data: this.mapTeamMembersToCreateManyData(
              body.match_attendance_first_team_members_ids,
              match_result.id,
            ),
          });
        }
        if (body.match_attendance_second_team_members_ids) {
          await tx.matchAttendance.createMany({
            data: this.mapTeamMembersToCreateManyData(
              body.match_attendance_second_team_members_ids,
              match_result.id,
            ),
          });
        }
        return match_result;
      });

      return {
        message: 'Match result create successfully',
        data: match_result,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            'You have already declare the match result',
          );
        }
      }
      throw error;
    }
  }

  async getMatchResultByMatchScheduleId(match_schedule_id: string) {
    try {
      const match_result = await this.prisma.matchResult.findFirst({
        where: {
          match_schedule_id,
        },
        include: {
          match_schedule: {
            select: {
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
            },
          },
          top_performers: {
            select: {
              first_team_members: {
                select: {
                  id: true,
                  is_removed: true,

                  team_member_role: true,
                  team_id: true,
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
                  is_removed: true,
                  team_member_role: true,
                  team_id: true,
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
          match_attendance: {
            select: {
              status: true,
              first_team_members: {
                select: {
                  id: true,
                  is_removed: true,
                  team_member_role: true,
                  team_id: true,
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
                  is_removed: true,
                  team_member_role: true,
                  team_id: true,
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
      if (!match_result) {
        throw new NotFoundException('Match result not found');
      }

      const firstTeamAttendance = [];
      const secondTeamAttendance = [];

      for (const attendance of match_result.match_attendance) {
        if (attendance.first_team_members) {
          firstTeamAttendance.push({
            id: attendance.first_team_members.id,
            is_removed: attendance.first_team_members.is_removed,
            team_id: attendance.first_team_members.team_id,
            team_member_role: attendance.first_team_members.team_member_role,
            status: attendance.status,
            user: attendance.first_team_members.user,
          });
        }
        if (attendance.second_team_members) {
          secondTeamAttendance.push({
            id: attendance.second_team_members.id,
            is_removed: attendance.second_team_members.is_removed,
            team_id: attendance.second_team_members.team_id,
            team_member_role: attendance.second_team_members.team_member_role,
            status: attendance.status,
            user: attendance.second_team_members.user,
          });
        }
      }

      return {
        data: {
          ...match_result,
          match_attendance: {
            first_team_members: firstTeamAttendance,
            second_team_members: secondTeamAttendance,
          },
        },
      };
    } catch (error) {
      throw error;
    }
  }
}

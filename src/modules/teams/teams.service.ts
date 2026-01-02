import {
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateTeamDto, GetAllTeamQueryDto, UpdateTeamDto } from './dto';
import { Prisma, Role, TeamMemberRole, User } from '@prisma/client';
import { getTakeAndSkip, PaginationRequest } from 'src/common/dtos';

@Injectable()
export class TeamsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user_id: string, body: CreateTeamDto) {
    try {
      return await this.prisma.team.create({
        data: {
          ...body,
          owner_id: user_id,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Team already exist');
        }
      }
      throw error;
    }
  }

  async getUserTeamByName(owner_id: string, name: string) {
    try {
      const teams = await this.prisma.$queryRawUnsafe(
        `SELECT * FROM "teams" WHERE name ILIKE $1 AND owner_id = $2 AND is_delete = false`,
        `%${name}%`,
        owner_id,
      );

      return {
        data: teams,
      };
    } catch (error) {
      throw error;
    }
  }

  async getUserTeams(user: User, query: GetAllTeamQueryDto) {
    try {
      const { take, skip } = getTakeAndSkip(query.page, query.size);
      let base_where_clause: Prisma.TeamScalarWhereInput = query.search
        ? {
            name: {
              contains: query.search,
              mode: 'insensitive',
            },
          }
        : {};

      let team_where_clause: Prisma.TeamWhereInput = {};
      let team_include: Prisma.TeamInclude = {};

      if (user.role === Role.TEAM_OWNER) {
        team_where_clause = {
          ...base_where_clause,
          owner_id: user.id,
          is_deleted: false,
        };
        team_include = {
          team_members: {
            where: {
              is_removed: false,
              team_member_role: {
                in: [TeamMemberRole.CAPTAIN, TeamMemberRole.PLAYER],
              },
            },
            select: {
              id: true,
              team_id: true,
              team_member_role: true,
              user_id: true,
              is_removed: true,
              user: {
                select: {
                  id: true,
                  user_name: true,
                  profile_picture_url: true,
                },
              },
            },
          },
          chat_room: true,
        };
      } else if (user.role === Role.USER) {
        team_where_clause = {
          ...base_where_clause,
          is_deleted: false,
          team_members: {
            some: {
              user_id: user.id,
            },
          },
        };
        team_include = {
          team_members: true,
          chat_room: true,
        };
      }

      const [teams, total_records] = await Promise.all([
        this.prisma.team.findMany({
          where: team_where_clause,
          include: team_include,
          take,
          skip,
          orderBy: {
            created_at: 'desc',
          },
        }),

        this.prisma.team.count({ where: team_where_clause }),
      ]);

      const total_pages = Math.ceil(total_records / take);

      let new_response;
      new_response = teams.map((team) => {
        const { chat_room, ...rest } = team;
        return {
          ...rest,
          is_chat_room_created: !!chat_room,
        };
      });

      if (user.role === Role.USER) {
        new_response = teams.map((team) => {
          const { chat_room, ...rest } = team;
          return {
            ...rest,
            is_chat_room_created: !!chat_room,
            is_removed_from_team:
              rest.team_members.find(
                (team_member) => team_member.user_id === user.id,
              )?.is_removed ?? false,
          };
        });
      }

      return {
        data: new_response,
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

  async getTeamMembersByTeamId(team_id: string, query?: PaginationRequest) {
    try {
      const { take, skip } = getTakeAndSkip(query.page, query.size);
      const [members, total_records] = await Promise.all([
        this.prisma.team.findUnique({
          where: {
            id: team_id,
          },
          include: {
            team_members: {
              where: {
                is_removed: false,
              },
              include: {
                user: true,
              },
              take,
              skip,
            },
          },
        }),

        this.prisma.team.count({
          where: {
            id: team_id,
            team_members: {
              every: {
                is_removed: false,
              },
            },
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

  async updateTeam(id: string, body: UpdateTeamDto) {
    try {
      if (body.type) {
        throw new NotAcceptableException('Team type cannot be changed');
      }

      const updated_data = await this.prisma.team.update({
        where: {
          id,
        },
        data: {
          ...body,
        },
      });
      return {
        message: 'Team update successfully',
        data: updated_data,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Team not found');
        }
      }
      throw error;
    }
  }

  async softDeleteTeamById(id: string) {
    try {
      const updated_data = await this.prisma.team.update({
        where: {
          id,
        },
        data: {
          is_deleted: true,
          team_members: {
            updateMany: {
              where: {
                team_id: id,
              },
              data: {
                is_removed: true,
              },
            },
          },
        },
      });
      return {
        message: 'Team delete successfully',
        data: updated_data,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Team not found');
        }
      }
      throw error;
    }
  }

  async getUserTeamById(owner_id: string, id: string) {
    try {
      return await this.prisma.$queryRawUnsafe<any>(
        `SELECT * FROM "teams" WHERE id = $1 AND owner_id = $2`,
        id,
        owner_id,
      );
    } catch (error) {
      throw error;
    }
  }

  async listTeamMembersByTeamId(team_id: string) {
    try {
      return await this.prisma.team.findUnique({
        where: {
          id: team_id,
        },
        include: {
          team_members: {
            where: {
              is_removed: false,
            },
            include: {
              user: true,
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async listUserTeams(owner_id: string) {
    try {
      return await this.prisma.team.findMany({
        where: { owner_id, is_deleted: false },
      });
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string) {
    try {
      return await this.prisma.team.findFirst({
        where: { id },
        include: { user: { select: { user_name: true } } },
      });
    } catch (error) {
      throw error;
    }
  }
}

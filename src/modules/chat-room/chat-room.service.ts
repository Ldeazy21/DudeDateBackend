import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import {
  CreateChatRoomDto,
  GetUserAllChatRoomQueryDto,
  SendChatRoomMessageDto,
} from './dto';
import { getTakeAndSkip, PaginationRequest } from 'src/common/dtos';
import { Prisma, Role } from '@prisma/client';
import { UserInterface } from 'src/modules/user/interface';
import { NotificationService } from 'src/modules/notification/notification.service';
import { NotificationPayloadDto } from 'src/modules/notification/dto';

@Injectable()
export class ChatRoomService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async create(body: CreateChatRoomDto) {
    try {
      const chat_room = await this.prisma.chatRoom.create({ data: body });
      return {
        message: 'Chat room create successfully',
        data: chat_room,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Chat room is already exist');
        }
      }
      throw error;
    }
  }

  async getUserChatRoom(
    user: UserInterface,
    query: GetUserAllChatRoomQueryDto,
  ) {
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

      let chat_room_where_clasue: Prisma.ChatRoomWhereInput = {};
      let chat_room_include: Prisma.ChatRoomInclude = {};

      if (user.role === Role.TEAM_OWNER) {
        chat_room_where_clasue = {
          team: {
            ...base_where_clause,
            is_deleted: false,
            owner_id: user.id,
          },
        };
        chat_room_include = {
          team: true,
        };
      } else if (user.role === Role.USER) {
        chat_room_where_clasue = {
          team: {
            ...base_where_clause,
            is_deleted: false,
            team_members: {
              some: {
                user_id: user.id,
              },
            },
          },
        };
        chat_room_include = {
          team: {
            include: {
              team_members: {
                where: {
                  user_id: user.id,
                },
                orderBy: {
                  updated_at: 'desc',
                },
                take: 1,
              },
            },
          },
        };
      }

      const [chat_rooms, total_records] = await Promise.all([
        this.prisma.chatRoom.findMany({
          where: chat_room_where_clasue,
          include: chat_room_include,
          take,
          skip,
          orderBy: {
            created_at: 'desc',
          },
        }),

        this.prisma.chatRoom.count({ where: chat_room_where_clasue }),
      ]);
      const total_pages = Math.ceil(total_records / take);

      let new_response;
      if (user.role === Role.USER) {
        new_response = chat_rooms.map((chat_room: any) => {
          const { team, ...rest } = chat_room;
          const {
            id,
            is_deleted,
            name,
            owner_id,
            created_at,
            updated_at,
            logo_url,
            description,
            type,
          } = team;
          return {
            ...rest,
            team: {
              id,
              is_deleted,
              name,
              owner_id,
              created_at,
              updated_at,
              logo_url,
              description,
              type,
            },
            is_removed_from_team: team.team_members[0]?.is_removed ?? false,
          };
        });
      }

      return {
        data: new_response ? new_response : chat_rooms,
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

  async getChatRoomMembersByTeamId(team_id: string, query: PaginationRequest) {
    try {
      const { take, skip } = getTakeAndSkip(query.page, query.size);

      const [chat_room_members, total_records] = await Promise.all([
        this.prisma.chatRoom.findFirst({
          where: {
            team_id,
          },
          include: {
            team: {
              include: {
                user: {
                  select: {
                    id: true,
                    user_name: true,
                    profile_picture_url: true,
                    role: true,
                  },
                },
                team_members: {
                  where: {
                    is_removed: false,
                  },
                  select: {
                    team_member_role: true,
                    user: {
                      select: {
                        id: true,
                        user_name: true,
                        profile_picture_url: true,
                        role: true,
                      },
                    },
                  },
                  take,
                  skip,
                  orderBy: {
                    user: {
                      user_name: 'desc',
                    },
                  },
                },
              },
            },
          },
        }),

        this.prisma.teamMember.count({
          where: {
            team_id,
            is_removed: false,
          },
        }),
      ]);

      const total_pages = Math.ceil(total_records / take);

      return {
        data: chat_room_members,
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

  async sendChatRoomMessage(user_id: string, body: SendChatRoomMessageDto) {
    try {
      const team = await this.prisma.team.findUnique({
        where: {
          id: body.team_id,
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

      let sender_id: string;
      let send_notification_payload: NotificationPayloadDto;

      if (team.owner_id === user_id) {
        sender_id = user_id;
        send_notification_payload = {
          user_ids: team.team_members.map((member) => member.user_id),
        };
      } else {
        sender_id = team.team_members
          .map((sender) => sender.user_id === user_id)
          .toString();

        send_notification_payload = {
          user_ids: [
            ...team.team_members
              .filter((member) => member.user_id !== user_id)
              .map((member) => member.user_id),
            team.owner_id,
          ],
        };
      }

      send_notification_payload = {
        ...send_notification_payload,
        title: team.name,
        content: body.message,
        data: {
          team_logo_url: team.logo_url,
        },
      };

      return await this.notificationService.sendNotification(
        send_notification_payload,
      );
    } catch (error) {
      throw error;
    }
  }
}

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateTeamInvitationDto, UpdateTeamMemberDto } from './dto';
import { TeamMembersService } from './team-memebers.service';
import { CreateTeamMemberInterface } from './interface/create-team-member.interface';
import { NotificationType } from 'src/modules/notification/dto';
import {
  EmailNotificationInterface,
  NotificationInterface,
} from 'src/modules/notification/interface';
import { NotificationService } from 'src/modules/notification/notification.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { NotificationPayloadDto } from 'src/modules/notification/dto';
import { TeamsService } from './teams.service';

@Injectable()
export class TeamInvitationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly teamMemberService: TeamMembersService,
    private readonly notificationService: NotificationService,
    private readonly teamService: TeamsService,
  ) {}

  async createTeamMemberInvitations(
    invited_by_id: string,
    body: CreateTeamInvitationDto,
  ) {
    const { team_id, invited_member_ids, team_name } = body;

    if (!invited_member_ids?.length) {
      return { message: 'No members provided to invite.' };
    }

    try {
      const receiver_ids = invited_member_ids.map(
        (member) => member.receiver_id,
      );

      let notification_payload: NotificationInterface[] = [];
      const title = 'Team Invitation';
      const content = `You have been invited to join the team ${team_name.toUpperCase()}`;
      for (const receiver_id of receiver_ids) {
        const team_invitation = await this.prisma.teamInvitation.create({
          data: {
            team_id,
            receiver_id,
          },
        });

        notification_payload.push({
          type: NotificationType.INVITATION,
          title,
          team_id,
          message: content,
          sender_id: invited_by_id,
          user_id: receiver_id,
          team_invitation_id: team_invitation.id,
        });
      }

      await this.notificationService.createManyNotification(
        notification_payload,
      );

      const send_notification_payload: NotificationPayloadDto = {
        user_ids: receiver_ids,
        title,
        type: NotificationType.INVITATION,
        content,
      };
      await this.notificationService.sendNotification(
        send_notification_payload,
      );

      return {
        message:
          'Team member invitation requests and notifications sent successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteById(id: string) {
    try {
      return await this.prisma.teamInvitation.delete({ where: { id } });
    } catch (error) {
      throw error;
    }
  }

  async acceptOrRejectInvitation(
    user_id: string,
    id: string,
    is_accepted: boolean,
  ) {
    try {
      if (is_accepted === true) {
        const already_team_member = await this.prisma.teamMember.findFirst({
          where: { AND: [{ user_id, is_removed: false }] },
        });
        if (already_team_member) {
          throw new ConflictException('You have already join a team');
        }
        const team_invitation = await this.prisma.teamInvitation.update({
          where: { id },
          data: { is_accepted },
        });

        const team_member_paylaod: CreateTeamMemberInterface = {
          team_id: team_invitation.team_id,
          user_id: team_invitation.receiver_id,
        };

        const existing_team_member =
          await this.teamMemberService.getRemovedTeamMember(
            team_member_paylaod.team_id,
            team_member_paylaod.user_id,
          );

        if (existing_team_member) {
          const update_data_payload: UpdateTeamMemberDto = {
            is_removed: false,
          };
          await this.teamMemberService.updateTeamMember(
            existing_team_member.id,
            update_data_payload,
          );
          await this.deleteById(id);
          return {
            message: 'Invitation accepted successfully',
          };
        }

        await this.teamMemberService.create(team_member_paylaod);
        await this.deleteById(id);
        return {
          message: 'Invitation accepted successfully',
        };
      }
      await this.deleteById(id);
      return { message: 'Invitation declined.' };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Not found');
        }
      }
      throw error;
    }
  }

  async createInvitationByEmail(body: CreateTeamInvitationDto) {
    try {
      console.log(body.email);

      const existing_team = await this.teamService.findById(body.team_id);
      if (!existing_team) {
        throw new NotFoundException('Team is not found');
      }
      body.team_name = existing_team.name;
      await this.prisma.teamInvitation.create({
        data: body,
      });
      const send_email_paylaod: EmailNotificationInterface = {
        email: body.email,
        subject: 'Team Inivitation',
        template: 'team-member-invitation',
        team_name: existing_team.name,
        invitor_name: existing_team.user.user_name,
      };
      await this.notificationService.sendEmail(send_email_paylaod);
      const title = 'Team Invitation';
      const content = `You have been invited to join the team ${existing_team.name.toUpperCase()}`;
      // const create_notification_payload: NotificationInterface = {
      //   type: NotificationType.INVITATION,
      //   title,
      //   team_id: body.team_id,
      //   message: content,
      //   sender_id: existing_team.owner_id,
      // };
      // await this.notificationService.createNotification()
      return {
        message: 'Team member invitation requests sent successfully',
      };
    } catch (error) {
      throw error;
    }
  }
}

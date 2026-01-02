import { Module } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { UserModule } from 'src/modules/user/user.module';
import { TeamMembersService } from './team-memebers.service';
import { NotificationModule } from 'src/modules/notification/notification.module';
import { TeamInvitationService } from './team-invitation.service';

@Module({
  imports: [UserModule, NotificationModule],
  controllers: [TeamsController],
  providers: [TeamsService, TeamMembersService, TeamInvitationService],
  exports: [TeamsService],
})
export class TeamModule {}

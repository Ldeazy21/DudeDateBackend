import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import {
  CreateTeamDto,
  CreateTeamInvitationDto,
  GetAllTeamQueryDto,
  UpdateTeamDto,
  UpdateTeamMemberDto,
} from './dto';
import {
  GetUser,
  Roles,
  TeamOwnerRoleOnly,
  UserRoleOnly,
} from 'src/common/decorators';
import { PaginationRequest } from 'src/common/dtos';
import { TeamMembersService } from './team-memebers.service';
import { ApiTags } from '@nestjs/swagger';
import { Role, TeamMemberRole, User } from '@prisma/client';
import { JwtGuard, RoleGuard } from 'src/core/guards';
import { TeamInvitationService } from './team-invitation.service';

@ApiTags('Teams')
@Controller('teams')
export class TeamsController {
  constructor(
    private readonly teamsService: TeamsService,
    private readonly teamMembersService: TeamMembersService,
    private readonly teamInvitationService: TeamInvitationService,
  ) {}

  // Team
  @TeamOwnerRoleOnly
  @UseGuards(JwtGuard, RoleGuard)
  @Post()
  async createTeam(
    @GetUser('id') user_id: string,
    @Body() body: CreateTeamDto,
  ) {
    return await this.teamsService.create(user_id, body);
  }

  @TeamOwnerRoleOnly
  @UseGuards(JwtGuard, RoleGuard)
  @Patch(':id/soft-delete')
  async softDeleteTeam(@Param('id') id: string) {
    return await this.teamsService.softDeleteTeamById(id);
  }

  @TeamOwnerRoleOnly
  @UseGuards(JwtGuard, RoleGuard)
  @Put(':id')
  async updateTeam(@Param('id') id: string, @Body() body: UpdateTeamDto) {
    return await this.teamsService.updateTeam(id, body);
  }

  // Team Member
  @TeamOwnerRoleOnly
  @UseGuards(JwtGuard, RoleGuard)
  @Patch('team-member/:id')
  async updateTeamMember(
    @Param('id') id: string,
    @Body() body: UpdateTeamMemberDto,
  ) {
    return await this.teamMembersService.updateTeamMember(id, body);
  }

  @TeamOwnerRoleOnly
  @UseGuards(JwtGuard, RoleGuard)
  @Patch('team-member-role/:team_id/:team_member_id')
  async updateTeamMemberRole(
    @Param('team_id') team_id: string,
    @Param('team_member_id') team_member_id: string,
    @Body('team_member_role') team_member_role: TeamMemberRole,
  ) {
    return await this.teamMembersService.updateTeamMemberRole(
      team_id,
      team_member_id,
      team_member_role,
    );
  }

  @TeamOwnerRoleOnly
  @UseGuards(JwtGuard, RoleGuard)
  @Patch('team-member/:id/soft-remove')
  async removeTeamMember(@Param('id') id: string) {
    return await this.teamMembersService.removeTeamMember(id);
  }

  // Team Invitation
  @TeamOwnerRoleOnly
  @UseGuards(JwtGuard, RoleGuard)
  @Post('send-team-member-invitation')
  async teamMemberInvitation(
    @GetUser('id') invited_by_id: string,
    @Body() body: CreateTeamInvitationDto,
  ) {
    return await this.teamInvitationService.createTeamMemberInvitations(
      invited_by_id,
      body,
    );
  }

  @UserRoleOnly
  @UseGuards(JwtGuard)
  @Patch('invitation-accept-or-reject/:id')
  async ac(
    @GetUser('id') user_id: string,
    @Param('id') id: string,
    @Body() { is_accepted }: { is_accepted: boolean },
  ) {
    return await this.teamInvitationService.acceptOrRejectInvitation(
      user_id,
      id,
      is_accepted,
    );
  }

  @Roles(Role.TEAM_OWNER, Role.USER)
  @UseGuards(JwtGuard, RoleGuard)
  @Get('team-member/:team_id')
  async getTeamMembersByTeamId(
    @Param('team_id') team_id: string,
    @Query() query: PaginationRequest,
  ) {
    return await this.teamsService.getTeamMembersByTeamId(team_id, query);
  }

  @UseGuards(JwtGuard)
  @Get('search')
  async getUserTeamByName(
    @GetUser('id') user_id: string,
    @Query('name') name: string,
  ) {
    return await this.teamsService.getUserTeamByName(user_id, name);
  }

  @Roles(Role.TEAM_OWNER, Role.USER)
  @UseGuards(JwtGuard, RoleGuard)
  @Get()
  async getUserTeams(
    @GetUser() user: User,
    @Query() query: GetAllTeamQueryDto,
  ) {
    return await this.teamsService.getUserTeams(user, query);
  }
}

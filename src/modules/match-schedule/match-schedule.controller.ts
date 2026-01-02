import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MatchScheduleService } from './match-schedule.service';
import { CreateMatchScheduleDto, GetAllMatchScheduleQueryDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
import { GetUser, Roles, TeamOwnerRoleOnly } from 'src/common/decorators';
import { JwtGuard, RoleGuard } from 'src/core/guards';
import { Role } from '@prisma/client';

@ApiTags('Match Schedule')
@Controller('match-schedule')
export class MatchScheduleController {
  constructor(private readonly matchScheduleService: MatchScheduleService) {}

  @TeamOwnerRoleOnly
  @UseGuards(JwtGuard, RoleGuard)
  @Post()
  async create(
    @GetUser('id') user_id: string,
    @Body() body: CreateMatchScheduleDto,
  ) {
    return await this.matchScheduleService.create(user_id, body);
  }

  @TeamOwnerRoleOnly
  @UseGuards(JwtGuard, RoleGuard)
  @Post(':id/recreate')
  async recreateMatchSchedule(
    @GetUser('id') user_id: string,
    @Param('id') id: string,
    @Body() body: CreateMatchScheduleDto,
  ) {
    return await this.matchScheduleService.recreateMatchSchedule(
      user_id,
      id,
      body,
    );
  }

  @Roles(Role.TEAM_OWNER, Role.USER)
  @UseGuards(JwtGuard, RoleGuard)
  @Get('all/:team_id')
  async getMatchSchedulesByTeamId(
    @Param('team_id') team_id: string,
    @Query() query: GetAllMatchScheduleQueryDto,
  ) {
    return await this.matchScheduleService.getMatchSchedulesByTeamId(
      team_id,
      query,
    );
  }

  @Roles(Role.TEAM_OWNER, Role.USER)
  @UseGuards(JwtGuard, RoleGuard)
  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.matchScheduleService.findById(id);
  }
}

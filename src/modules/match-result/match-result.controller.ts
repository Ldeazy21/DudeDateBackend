import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { MatchResultService } from './match-result.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateMatchResultDto } from './dto';
import { JwtGuard, RoleGuard } from 'src/core/guards';
import { TeamOwnerRoleOnly } from 'src/common/decorators';

@ApiTags('Match Result')
@Controller('match-result')
export class MatchResultController {
  constructor(private readonly matchResultService: MatchResultService) {}

  @TeamOwnerRoleOnly
  @UseGuards(JwtGuard, RoleGuard)
  @Post()
  async create(@Body() body: CreateMatchResultDto) {
    return await this.matchResultService.create(body);
  }

  @TeamOwnerRoleOnly
  @UseGuards(JwtGuard, RoleGuard)
  @Get(':match_schedule_id')
  async getMatchResultByMatchScheduleId(
    @Param('match_schedule_id') match_schedule_id: string,
  ) {
    return await this.matchResultService.getMatchResultByMatchScheduleId(
      match_schedule_id,
    );
  }
}

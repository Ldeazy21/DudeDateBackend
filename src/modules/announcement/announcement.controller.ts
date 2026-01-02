import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateAnnouncementDto, GetUserAllAnnouncementQueryDto } from './dto';
import { JwtGuard, RoleGuard } from 'src/core/guards';
import { GetUser, TeamOwnerRoleOnly } from 'src/common/decorators';
import { User } from '@prisma/client';
import { UserInterface } from 'src/modules/user/interface';

@ApiTags('Announcement')
@Controller('announcement')
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @TeamOwnerRoleOnly
  @UseGuards(JwtGuard, RoleGuard)
  @Post()
  async create(
    @GetUser('id') user_id: string,
    @Body() body: CreateAnnouncementDto,
  ) {
    return await this.announcementService.create(user_id, body);
  }

  @UseGuards(JwtGuard)
  @Get('user')
  async getUserAnnouncements(
    @GetUser() user: UserInterface,
    @Query() query: GetUserAllAnnouncementQueryDto,
  ) {
    return await this.announcementService.getUserAnnouncements(user, query);
  }
}

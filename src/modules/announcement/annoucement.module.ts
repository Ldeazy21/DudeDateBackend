import { Module } from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
import { AnnouncementController } from './announcement.controller';
import { TeamModule } from 'src/modules/teams/teams.module';
import { NotificationModule } from 'src/modules/notification/notification.module';

@Module({
  imports: [TeamModule, NotificationModule],
  controllers: [AnnouncementController],
  providers: [AnnouncementService],
})
export class AnnouncementModule {}

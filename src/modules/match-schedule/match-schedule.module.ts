import { Module } from '@nestjs/common';
import { MatchScheduleService } from './match-schedule.service';
import { MatchScheduleController } from './match-schedule.controller';
import { TeamModule } from 'src/modules/teams/teams.module';
import { NotificationModule } from 'src/modules/notification/notification.module';

@Module({
  imports: [TeamModule, NotificationModule],
  controllers: [MatchScheduleController],
  providers: [MatchScheduleService],
})
export class MatchScheduleModule {}

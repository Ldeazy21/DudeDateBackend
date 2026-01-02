import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { EventsModule } from '../events/events.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot(), EventsModule],
  providers: [TasksService],
})
export class TasksModule {}

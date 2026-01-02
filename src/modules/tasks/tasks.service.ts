import { Injectable } from '@nestjs/common';
import { EventsService } from '../events/events.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { log } from 'console';

@Injectable()
export class TasksService {
  constructor(private readonly eventService: EventsService) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM, {
    timeZone: 'America/New_York',
  })
  async handleEventReminderCron() {
    log('Running Cron Job For Event Reminder ');
    return await this.eventService.sendEventReminders();
  }
}

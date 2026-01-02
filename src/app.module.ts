import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { NotificationModule } from './modules/notification/notification.module';
import { EventsModule } from './modules/events/events.module';
import { TeamModule } from './modules/teams/teams.module';
import { MatchScheduleModule } from './modules/match-schedule/match-schedule.module';
import { MatchResultModule } from './modules/match-result/match-result.module';
import { AnnouncementModule } from './modules/announcement/annoucement.module';
import { ChatRoomModule } from './modules/chat-room/chat-room.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { AppConfig, MailConfig } from './config';
import { TasksModule } from './modules/tasks/tasks.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MailerModule.forRootAsync({
      useClass: MailConfig,
    }),
    NotificationModule,
    EventsModule,
    TeamModule,
    MatchScheduleModule,
    MatchResultModule,
    AnnouncementModule,
    ChatRoomModule,
    PaymentsModule,
    WebhooksModule,
    TasksModule,
  ],

  controllers: [AppController],
  providers: [AppService, AppConfig],
})
export class AppModule {}

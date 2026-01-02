import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto, NotificationPayloadDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
import { OneSignalTemplateService } from './one-signal-template.service';
import { PaginationRequest } from 'src/common/dtos';
import { JwtGuard } from 'src/core/guards';
import { GetUser } from 'src/common/decorators';

@ApiTags('Notification')
@Controller('notification')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly oneSignalTemplateService: OneSignalTemplateService,
  ) {}

  @Post()
  async createNotification(@Body() body: CreateNotificationDto) {
    return await this.notificationService.createNotification(body);
  }

  @Post('send')
  async sendNotification(@Body() body: NotificationPayloadDto) {
    return await this.notificationService.sendNotification(body);
  }

  @Get('one-signal/templates')
  async getOneSignalTemplates(@Query() query: PaginationRequest) {
    return await this.oneSignalTemplateService.getAllTemplates(query);
  }

  @UseGuards(JwtGuard)
  @Patch('mark-all-as-read')
  async m(@GetUser('id') user_id: string) {
    return await this.notificationService.markAllNotificationsAsRead(user_id);
  }

  @UseGuards(JwtGuard)
  @Get('user/unread-count')
  async getUserUnreadNotifications(@GetUser('id') user_id: string) {
    return await this.notificationService.getUserUnreadNotifications(user_id);
  }

  @UseGuards(JwtGuard)
  @Get('user')
  async getUserNotifiacations(
    @GetUser('id') user_id: string,
    @Query() query: PaginationRequest,
  ) {
    return await this.notificationService.getUserNotifications(user_id, query);
  }
}

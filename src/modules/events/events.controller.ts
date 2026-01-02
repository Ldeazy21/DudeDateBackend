import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateEventDto,
  GetAllEventsQueryDto,
  GetPublicEventDto,
  GetUserAllEventsQueryDto,
  UpdateEventDto,
} from './dto';
import { JwtGuard } from 'src/core/guards/jwt.guard';
import { GetUser } from 'src/common/decorators';
import { User } from '@prisma/client';
import { PaginationRequest } from 'src/common/dtos';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(JwtGuard)
  @Post()
  async create(@GetUser() user: User, @Body() body: CreateEventDto) {
    return await this.eventsService.create(user, body);
  }
  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(
    @GetUser('id') user_id: string,
    @Param('id') id: string,
    @Body() body: UpdateEventDto,
  ) {
    return await this.eventsService.update(user_id, id, body);
  }

  @UseGuards(JwtGuard)
  @Get('user')
  async getUserAllEvents(
    @GetUser('id') user_id: string,
    @Query() query: GetUserAllEventsQueryDto,
  ) {
    return await this.eventsService.getUserAllEvents(user_id, query);
  }

  @Get('public')
  async getPublicEvents(@Query() query: GetPublicEventDto) {
    return await this.eventsService.getPublicEvents(query);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async getById(@GetUser('id') user_id: string, @Param('id') id: string) {
    return await this.eventsService.getById(user_id, id);
  }

  @UseGuards(JwtGuard)
  @Get()
  async getAllEvents(
    @GetUser() user: User,
    @Query() query: GetAllEventsQueryDto,
  ) {
    return await this.eventsService.getAllEvents(user, query);
  }
}

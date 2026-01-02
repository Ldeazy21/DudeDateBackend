import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ChatRoomService } from './chat-room.service';
import {
  CreateChatRoomDto,
  GetUserAllChatRoomQueryDto,
  SendChatRoomMessageDto,
} from './dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/core/guards';
import { GetUser } from 'src/common/decorators';
import { UserInterface } from 'src/modules/user/interface';
import { PaginationRequest } from 'src/common/dtos';

@ApiTags('Chat Room')
@Controller('chat-room')
export class ChatRoomController {
  constructor(private readonly chatRoomService: ChatRoomService) {}

  @UseGuards(JwtGuard)
  @Post()
  async create(@Body() body: CreateChatRoomDto) {
    return await this.chatRoomService.create(body);
  }

  @UseGuards(JwtGuard)
  @HttpCode(200)
  @Post('send/message')
  async sendChatRoomMessage(
    @GetUser('id') user_id: string,
    @Body() body: SendChatRoomMessageDto,
  ) {
    return await this.chatRoomService.sendChatRoomMessage(user_id, body);
  }

  @UseGuards(JwtGuard)
  @Get('user')
  async get(
    @GetUser() user: UserInterface,
    @Query() query: GetUserAllChatRoomQueryDto,
  ) {
    return await this.chatRoomService.getUserChatRoom(user, query);
  }

  @UseGuards(JwtGuard)
  @Get(':team_id')
  async getChatRoomMembersByTeamId(
    @Param('team_id') team_id: string,
    @Query() query: PaginationRequest,
  ) {
    return await this.chatRoomService.getChatRoomMembersByTeamId(
      team_id,
      query,
    );
  }
}

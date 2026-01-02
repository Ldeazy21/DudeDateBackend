import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/core/guards/jwt.guard';
import { User } from '@prisma/client';
import { GetUser } from 'src/common/decorators';
import { UpdateUserDto } from './dto';
import { PaginationRequest } from 'src/common/dtos';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtGuard)
  @Patch('update')
  async update(@GetUser('id') user_id: string, @Body() body: UpdateUserDto) {
    return await this.userService.update(user_id, body);
  }

  @UseGuards(JwtGuard)
  @Get('get-all-user/:team_id')
  async getAllUser(
    @GetUser('id') user_id: string,
    @Param('team_id') team_id: string,
    @Query() query: PaginationRequest,
  ) {
    return await this.userService.getAllUser(user_id, team_id, query);
  }

  @UseGuards(JwtGuard)
  @Get()
  getUser(@GetUser() user: User) {
    const { password, ...userWithoutPassword } = user;
    return { data: userWithoutPassword };
  }
}

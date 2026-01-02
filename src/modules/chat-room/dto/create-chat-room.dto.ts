import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChatRoomDto {
  @ApiProperty({
    description: 'ID of the team associated with this chat room',
    example: 'b84e438a-b421-4c70-a0c7-0d1181e0e48e',
  })
  @IsUUID()
  team_id: string;
}

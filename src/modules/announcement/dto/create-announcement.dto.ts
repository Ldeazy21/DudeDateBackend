import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsUUID,
} from 'class-validator';

class TeamIdsDto {
  @ApiProperty({
    example: 'team-uuid',
    description: 'ID of the team sending the invitation',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  team_id?: string;
}

export class CreateAnnouncementDto {
  @ApiProperty({
    example: 'Team Meeting',
    description: 'The subject/title of the announcement',
  })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({
    example: 'There will be a meeting tomorrow at 10 AM.',
    description: 'Detailed content or message of the announcement',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: ['team-uuid-1', 'team-uuid-2'],
    description: 'Array of team IDs the announcement is for',
    required: false,
  })
  @IsOptional()
  @IsArray()
  team_ids?: TeamIdsDto[];

  @ApiProperty({
    example: true,
    description:
      'If true, the announcement will be sent to all teams. If false or omitted, only the specified teams will be notified.',
    required: false,
  })
  @IsOptional()
  notify_all_team?: boolean;
}

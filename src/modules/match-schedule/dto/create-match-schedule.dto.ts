import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsUUID,
  IsNotEmpty,
  IsDateString,
  IsNumber,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { CreateMatchScheduleTeamMemberDto } from './create-match-schedule-team-member.dto';
import { Type } from 'class-transformer';

export class CreateMatchScheduleDto {
  @ApiProperty({
    example: '10:00 AM',
    description: 'Start time of the match (in string format)',
  })
  @IsString()
  @IsNotEmpty()
  start_time: string;

  @ApiProperty({
    example: '12:00 PM',
    description: 'End time of the match (in string format)',
  })
  @IsString()
  @IsNotEmpty()
  end_time: string;

  @ApiProperty({
    example: '2025-06-01T10:00:00Z',
    description: 'Start date of the match',
  })
  @IsDateString()
  @IsNotEmpty()
  start_date: string;

  @ApiProperty({
    example: '2025-06-01T12:00:00Z',
    description: 'End date of the match',
  })
  @IsDateString()
  @IsNotEmpty()
  end_data: string;

  @ApiProperty({
    example: 37.7749,
    description: 'Latitude of the match location',
  })
  @IsNumber()
  latitude: number;

  @ApiProperty({
    example: -122.4194,
    description: 'Longitude of the match location',
  })
  @IsNumber()
  longitude: number;

  @ApiProperty({
    example: '123 Main St, San Francisco, CA',
    description: 'Address of the match location',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: '$50', description: 'Match fee as a string' })
  @IsString()
  @IsNotEmpty()
  match_fee: string;

  @ApiProperty({
    example: 'Quarter Final Match',
    description: 'Description of the match',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 'uuid-of-first-team',
    description: 'ID of the first team',
  })
  @IsUUID()
  @IsNotEmpty()
  first_team_id: string;

  @ApiProperty({
    example: 'uuid-of-second-team',
    description: 'ID of the second team',
  })
  @IsUUID()
  @IsNotEmpty()
  second_team_id: string;

  @ApiProperty({
    type: [CreateMatchScheduleTeamMemberDto],
    description: 'List of team members participating in the match',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMatchScheduleTeamMemberDto)
  match_schedule_first_team_member_ids: CreateMatchScheduleTeamMemberDto[];

  @ApiProperty({
    type: [CreateMatchScheduleTeamMemberDto],
    description: 'List of team members participating in the match',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMatchScheduleTeamMemberDto)
  match_schedule_second_team_members_ids: CreateMatchScheduleTeamMemberDto[];
}

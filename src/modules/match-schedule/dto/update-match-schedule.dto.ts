import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsUUID,
  IsDateString,
  IsNumber,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { CreateMatchScheduleTeamMemberDto } from './create-match-schedule-team-member.dto';
import { Type } from 'class-transformer';

export class UpdateMatchScheduleDto {
  @ApiProperty({ example: 'Team A', description: 'Name of the first team' })
  @IsString()
  @IsOptional()
  first_team_name?: string;

  @ApiProperty({ example: 'Team B', description: 'Name of the second team' })
  @IsString()
  @IsOptional()
  second_team_name?: string;

  @ApiProperty({
    example: '10:00 AM',
    description: 'Start time of the match (in string format)',
  })
  @IsString()
  @IsOptional()
  start_time?: string;

  @ApiProperty({
    example: '12:00 PM',
    description: 'End time of the match (in string format)',
  })
  @IsString()
  @IsOptional()
  end_time?: string;

  @ApiProperty({
    example: '2025-06-01T10:00:00Z',
    description: 'Start date of the match',
  })
  @IsDateString()
  @IsOptional()
  start_date?: string;

  @ApiProperty({
    example: '2025-06-01T12:00:00Z',
    description: 'End date of the match',
  })
  @IsDateString()
  @IsOptional()
  end_data?: string;

  @ApiProperty({
    example: 37.7749,
    description: 'Latitude of the match location',
  })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiProperty({
    example: -122.4194,
    description: 'Longitude of the match location',
  })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiProperty({
    example: '123 Main St, San Francisco, CA',
    description: 'Address of the match location',
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: '$50', description: 'Match fee as a string' })
  @IsString()
  @IsOptional()
  match_fee?: string;

  @ApiProperty({
    example: 'Quarter Final Match',
    description: 'Description of the match',
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    example: 'uuid-of-first-team',
    description: 'ID of the first team',
  })
  @IsUUID()
  @IsOptional()
  first_team_id?: string;

  @ApiProperty({
    example: 'uuid-of-second-team',
    description: 'ID of the second team',
  })
  @IsUUID()
  @IsOptional()
  second_team_id?: string;

  @ApiProperty({
    type: [CreateMatchScheduleTeamMemberDto],
    description: 'List of team members participating in the match',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMatchScheduleTeamMemberDto)
  @IsOptional()
  match_schedule_first_team_member_ids?: CreateMatchScheduleTeamMemberDto[];

  @ApiProperty({
    type: [CreateMatchScheduleTeamMemberDto],
    description: 'List of team members participating in the match',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMatchScheduleTeamMemberDto)
  @IsOptional()
  match_schedule_second_team_members_ids?: CreateMatchScheduleTeamMemberDto[];
}

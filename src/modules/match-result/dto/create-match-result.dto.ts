import {
  IsUUID,
  IsInt,
  IsString,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateMatchAttendanceDto, CreateTopPerformerDto } from '.';

export class CreateMatchResultDto {
  @ApiProperty({
    description: 'Final score of the first team',
    example: 3,
  })
  @IsInt()
  final_first_team_score: number;

  @ApiProperty({
    description: 'Final score of the second team',
    example: 2,
  })
  @IsInt()
  final_second_team_score: number;

  @ApiProperty({
    description: 'Match highlights or summary',
    example: 'A thrilling match ending with a late goal.',
  })
  @IsString()
  highlights: string;

  @ApiProperty({
    description: 'Match schedule ID (foreign key)',
    example: 'c7e3c7b3-e3f3-42df-80df-97c9baf708d5',
  })
  @IsUUID()
  match_schedule_id: string;

  @ApiProperty({
    type: [CreateTopPerformerDto],
    description: 'List of team members participating in the match',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTopPerformerDto)
  @IsOptional()
  top_performer_first_team_members_ids?: CreateTopPerformerDto[];

  @ApiProperty({
    type: [CreateTopPerformerDto],
    description: 'List of team members participating in the match',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTopPerformerDto)
  @IsOptional()
  top_performer_second_team_members_ids?: CreateTopPerformerDto[];

  @ApiProperty({
    type: [CreateTopPerformerDto],
    description: 'List of team members participating in the match',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMatchAttendanceDto)
  @IsOptional()
  match_attendance_first_team_members_ids?: CreateMatchAttendanceDto[];

  @ApiProperty({
    type: [CreateTopPerformerDto],
    description: 'List of team members participating in the match',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMatchAttendanceDto)
  @IsOptional()
  match_attendance_second_team_members_ids?: CreateMatchAttendanceDto[];
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { AttendanceStatus } from '@prisma/client'; // Adjust this if your enum is declared elsewhere

export class CreateMatchAttendanceDto {
  //   @ApiProperty({
  //     description: 'ID of the match result',
  //     example: 'b5f1c2f3-94a2-4d1e-ae02-7a2d073be16a',
  //   })
  //   @IsUUID()
  //   match_result_id: string;

  @ApiPropertyOptional({
    description: 'ID of the first team member (optional)',
    example: 'fe3e2421-79de-44ef-89e4-b8f94e1dd82c',
  })
  @IsUUID()
  @IsOptional()
  first_team_member_id?: string;

  @ApiPropertyOptional({
    description: 'ID of the second team member (optional)',
    example: '4e9c8b8a-2c60-47e6-9f80-19c86f4b8c89',
  })
  @IsUUID()
  @IsOptional()
  second_team_member_id?: string;

  @ApiPropertyOptional({
    description: 'Attendance status',
    enum: AttendanceStatus,
    default: AttendanceStatus.PENDING,
  })
  @IsEnum(AttendanceStatus)
  @IsOptional()
  status?: AttendanceStatus;
}

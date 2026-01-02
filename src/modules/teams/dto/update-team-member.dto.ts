import { ApiProperty } from '@nestjs/swagger';
import { TeamMemberRole } from '@prisma/client';
import { IsBoolean, IsEnum, IsOptional, IsUUID } from 'class-validator';

export class UpdateTeamMemberDto {
  @ApiProperty({
    description: 'Whether the member has been removed from the team',
    required: false,
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  is_removed?: boolean;

  @ApiProperty({
    description: 'UUID of the team',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  team_id?: string;

  @ApiProperty({
    description: 'UUID of the member (user)',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  user_id?: string;
}

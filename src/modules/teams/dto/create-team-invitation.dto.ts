import { IsArray, IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class InvitedMemberDto {
  @ApiProperty({
    example: 'user-uuid',
    description: 'ID of a single invited user',
  })
  @IsString()
  receiver_id: string;
}
export class CreateTeamInvitationDto {
  @ApiPropertyOptional({
    example: 'example@email.com',
    description: 'Email of the invited user',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: 'team-uuid',
    description: 'ID of the team sending the invitation',
  })
  @IsString()
  team_id: string;

  @ApiProperty({
    example: 'user-uuid',
    description: 'ID of the user who receive the invitation',
  })
  @IsArray()
  invited_member_ids: InvitedMemberDto[];

  @ApiProperty({
    example: 'wonder start',
    description: 'Name of the team name',
  })
  @IsString()
  team_name: string;
}

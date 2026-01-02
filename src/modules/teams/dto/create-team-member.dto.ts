import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty } from 'class-validator';

export class CreateTeamMemberDto {
  @ApiProperty({ example: 'uuid-of-team', description: 'ID of the team' })
  @IsUUID()
  @IsNotEmpty()
  team_id: string;

  @ApiProperty({
    example: 'uuid-of-user',
    description: 'ID of the user who is a member of the team',
  })
  @IsUUID()
  @IsNotEmpty()
  user_id: string;
}

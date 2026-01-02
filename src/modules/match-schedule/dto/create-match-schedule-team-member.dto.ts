import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateMatchScheduleTeamMemberDto {
  @ApiProperty({
    description: 'Match player from the first team',
    example: 'd97b1de0-56d9-4de4-ae0d-4329df878a7e',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  team_member_id: string;

  @ApiProperty({
    description: 'Match player from the first team',
    example: 'd97b1de0-56d9-4de4-ae0d-4329df878a7e',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  user_id: string;
}

import { IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTopPerformerDto {
  // @ApiProperty({
  //   description: 'Top performer from the first team',
  //   example: 'd97b1de0-56d9-4de4-ae0d-4329df878a7e',
  // })
  // @IsOptional()
  // first_team_member_id?: string;

  // @ApiProperty({
  //   description: 'Top performer from the second team',
  //   example: '1a5c4c2e-b69e-42c7-b52d-4467c4db3f2f',
  // })
  // @IsUUID()
  // @IsOptional()
  // second_team_member_id?: string;

  @ApiProperty({
    description: 'Top performer from the second team',
    example: '1a5c4c2e-b69e-42c7-b52d-4467c4db3f2f',
  })
  @IsUUID()
  @IsOptional()
  team_member_id?: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsOptional } from 'class-validator';

export class UpdateTeamDto {
  @ApiProperty({ example: 'The Invincibles', description: 'Name of the team' })
  @IsString()
  @IsOptional()
  @Transform(({ value }) =>
    value
      .toLowerCase()
      .split(' ')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
  )
  name?: string;

  @ApiProperty({
    example: 'Football',
    description: 'Type or category of the team',
  })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({
    example: 'This is a legendary football team.',
    description: 'Description about the team',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'https://example.com/logo.png',
    description: 'Logo URL of the team',
  })
  @IsString()
  @IsOptional()
  logo_url?: string;
}

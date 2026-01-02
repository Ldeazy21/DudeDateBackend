import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class CreateTeamDto {
  @ApiProperty({ example: 'The Invincibles', description: 'Name of the team' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) =>
    value
      .toLowerCase()
      .split(' ')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
  )
  name: string;

  @ApiProperty({
    example: 'Football',
    description: 'Type or category of the team',
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    example: 'This is a legendary football team.',
    description: 'Description about the team',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 'https://example.com/logo.png',
    description: 'Logo URL of the team',
  })
  @IsString()
  @IsUrl()
  logo_url: string;
}

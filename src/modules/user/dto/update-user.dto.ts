import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, Length, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @Length(2, 50)
  @Transform(({ value }) =>
    value
      .toLowerCase()
      .split(' ')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
  )
  user_name?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Transform(({ value }) =>
    value
      .toLowerCase()
      .split(' ')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
  )
  first_name?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Transform(({ value }) =>
    value
      .toLowerCase()
      .split(' ')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
  )
  last_name?: string;

  @ApiProperty({ description: 'User profile picture' })
  @IsString()
  @IsOptional()
  profile_picture_url?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Length(2, 50)
  phone_number?: string;
}

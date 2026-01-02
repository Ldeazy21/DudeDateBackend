import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsString,
  IsEmail,
  Length,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(3, 30)
  @Transform(({ value }) =>
    value
      .toLowerCase()
      .split(' ')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
  )
  user_name: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(6, 100)
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  phone_number: string;

  @ApiProperty({ description: 'User profile picture' })
  @IsString()
  @IsOptional()
  profile_picture_url?: string;

  @ApiProperty({
    description:
      'Indicates whether the user is an owner or not. True for owner, false for regular user.',
  })
  @IsBoolean()
  @IsOptional()
  @IsNotEmpty()
  is_owner: boolean;

  @ApiProperty({
    description:
      'Specifies the role of the user. Can be either "USER" or "TEAM_OWNER".',
    enum: Role,
  })
  @IsBoolean()
  @IsString()
  @IsOptional()
  role?: Role;
}

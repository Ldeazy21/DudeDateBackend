import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Email address of the user',
    example: 'user@example.com',
    required: false,
  })
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @ApiProperty({
    description: 'Password of the user account',
    example: 'StrongP@ssw0rd!',
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 100)
  password: string;
}

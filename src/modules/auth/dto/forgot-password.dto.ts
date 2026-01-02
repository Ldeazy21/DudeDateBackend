import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'New password to set for the user account',
    example: 'StrongP@ssw0rd!',
  })
  @IsNotEmpty()
  @Length(6, 100)
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Confirmation of the new password (must match newPassword)',
    example: 'StrongP@ssw0rd!',
  })
  @IsNotEmpty()
  @Length(6, 100)
  @IsString()
  confirm_password: string;
}

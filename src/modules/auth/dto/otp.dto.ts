import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
export enum SendOtpPurpose {
  EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
}
export class SendOtpDto {
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
    description: 'Email address of the user',
    example: 'user@example.com',
    required: false,
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(SendOtpPurpose)
  purpose: SendOtpPurpose;
}
export class VerifyOtpDto {
  @ApiProperty({
    description: 'Unique identifier of the admin receiving the OTP',
    example: 'f4a3b2c1-d6e5-7890-1234-56789abcdef2',
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description:
      'The Code sent to the user for verification, must be exactly 6 digits.',
    example: '012345',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  otp: string;
}

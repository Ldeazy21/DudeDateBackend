import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsDate,
  IsNumber,
  IsEnum,
  IsUrl,
  IsBoolean,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { EventType } from '@prisma/client';

export class CreateEventDto {
  @ApiProperty({ description: 'Title of the event' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) =>
    value
      .toLowerCase()
      .split(' ')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
  )
  title: string;

  @ApiProperty({ description: 'URL to the event image' })
  @IsString()
  @IsNotEmpty()
  img_url: string;

  @ApiProperty({ description: 'Start date of the event' })
  @Type(() => Date)
  @IsDate()
  start_date: Date;

  @ApiProperty({ description: 'End date of the event' })
  @Type(() => Date)
  @IsDate()
  end_date: Date;

  @ApiProperty({ description: 'Start time of the event' })
  @Type(() => Date)
  @IsDate()
  start_time: Date;

  @ApiProperty({ description: 'End time of the event' })
  @Type(() => Date)
  @IsDate()
  end_time: Date;

  @ApiProperty({ description: 'Description of the event' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Latitude location of the event',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({
    description: 'Longitude location of the event',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiProperty({ description: 'Address of the event', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    description: 'Event fee (can be free or priced)',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.toUpperCase())
  event_fee?: string;

  @ApiProperty({
    description: 'Type of the event (PUBLIC or PRIVATE)',
    enum: EventType,
    default: EventType.PUBLIC,
  })
  @IsOptional()
  @IsEnum(EventType)
  type?: EventType;

  @ApiProperty({ description: 'Ticket purchase URL', required: false })
  @IsOptional()
  @IsUrl()
  ticket_purchase_url?: string;

  @ApiProperty({
    description: 'Phone number of the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone_number?: string;

  @ApiProperty({ description: 'Account title for payment', required: false })
  @IsOptional()
  @IsString()
  payment_detail?: string;

  @ApiProperty({
    description: 'Specifies whether the event is free or requires payment',
    example: true,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  is_free?: boolean;

  @ApiProperty({
    description:
      'Indicates whether notifications should be sent to all team members.',
    example: true,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  notify_all_team?: boolean;
}

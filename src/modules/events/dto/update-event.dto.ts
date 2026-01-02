import { ApiProperty } from '@nestjs/swagger';
import { EventStatus, EventType } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsString,
  IsDateString,
  IsOptional,
  IsNumber,
  IsEnum,
} from 'class-validator';

export class UpdateEventDto {
  @ApiProperty({ description: 'Title of the event' })
  @IsString()
  @IsOptional()
  @Transform(({ value }) =>
    value
      .toLowerCase()
      .split(' ')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
  )
  title?: string;

  @ApiProperty({ description: 'Image URL for the event' })
  @IsString()
  @IsOptional()
  img_url?: string;

  @ApiProperty({
    description: 'Start date of the event',
    example: '2025-05-22T10:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  start_date?: Date;

  @ApiProperty({
    description: 'End date of the event',
    example: '2025-05-22T12:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  end_date?: Date;

  @ApiProperty({ description: 'Detailed description of the event' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Latitude of the event location',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({
    description: 'Longitude of the event location',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiProperty({
    description: 'Physical address of the event',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ enum: EventType, default: EventType.PUBLIC })
  @IsOptional()
  @IsEnum(EventType)
  type?: EventType;

  @ApiProperty({
    description: 'Current status of the event',
    enum: EventStatus,
    example: EventStatus.PENDING,
    default: EventStatus.PENDING,
  })
  @IsEnum(EventStatus)
  @IsOptional()
  status?: EventStatus;
}

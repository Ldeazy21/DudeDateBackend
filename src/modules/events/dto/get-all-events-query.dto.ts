import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EventType } from '@prisma/client';
import { IsOptional, IsEnum, IsString } from 'class-validator';
import { PaginationRequest } from 'src/common/dtos';

export class GetAllEventsQueryDto extends PaginationRequest {
  @ApiProperty({
    description: 'Type of the event (PUBLIC or PRIVATE)',
    enum: EventType,
    default: EventType.PUBLIC,
  })
  @IsOptional()
  @IsEnum(EventType)
  type?: EventType;

  @ApiPropertyOptional({
    description: 'Optional search string for filtering records',
    example: 'John',
  })
  @IsString()
  @IsOptional()
  search?: string;
}

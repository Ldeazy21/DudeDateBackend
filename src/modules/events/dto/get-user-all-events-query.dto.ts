import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { PaginationRequest } from 'src/common/dtos';

export enum EventTimeRange {
  UPCOMING = 'UPCOMING',
  PAST = 'PAST',
  ON_GOING = 'ON_GOING',
}

export class GetUserAllEventsQueryDto extends PaginationRequest {
  @ApiPropertyOptional({
    description: 'Filter events by time',
    enum: EventTimeRange,
    example: EventTimeRange.UPCOMING,
  })
  @IsOptional()
  @IsEnum(EventTimeRange)
  time_range?: EventTimeRange;
}

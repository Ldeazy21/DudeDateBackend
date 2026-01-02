import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';
import { toInt } from 'radash';

export enum SortBy {
  ASC = 'asc',
  DESC = 'desc',
}

export class PaginationRequest {
  @ApiPropertyOptional({ example: 1, default: 1 })
  @Transform(({ value }) => Number(value))
  @Min(1)
  @IsNumber()
  @IsOptional()
  page: number = 1;

  @ApiPropertyOptional({ example: 50, default: 50 })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(1)
  @IsOptional()
  size: number = 50;
}

export function getTakeAndSkip(
  page: string | number | null | undefined,
  size: string | number | null | undefined,
  defaultSize = 10,
  maxSize = 999,
): { take: number | undefined; skip: number | undefined } {
  if (!page && !size) return { take: undefined, skip: undefined };

  let nPage = toInt(page, 1);
  let nSize = toInt(size, 1);

  if (nPage < 1) nPage = 1;
  if (nSize < 1) nSize = defaultSize;
  if (nSize > maxSize) nSize = maxSize;

  return {
    take: nSize,
    skip: (nPage - 1) * nSize,
  };
}

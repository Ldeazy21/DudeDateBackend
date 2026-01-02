import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { PaginationRequest } from 'src/common/dtos';

export class GetUserAllChatRoomQueryDto extends PaginationRequest {
  @ApiPropertyOptional({
    description: 'Optional search string for filtering records',
    example: 'John',
  })
  @IsString()
  @IsOptional()
  search?: string;
}

import { Module } from '@nestjs/common';
import { MatchResultService } from './match-result.service';
import { MatchResultController } from './match-result.controller';

@Module({
  controllers: [MatchResultController],
  providers: [MatchResultService],
})
export class MatchResultModule {}

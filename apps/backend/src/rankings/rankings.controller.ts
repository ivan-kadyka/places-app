import { Controller, Get, Query } from '@nestjs/common';
import { GetRankingsQueryDto } from './dto/get-rankings-query.dto';
import { RankingsService } from './rankings.service';

@Controller('rankings')
export class RankingsController {
  constructor(private readonly rankingsService: RankingsService) {}

  @Get()
  getRankings(@Query() query: GetRankingsQueryDto) {
    return this.rankingsService.getRankingsForCity(query.city, query.country);
  }
}

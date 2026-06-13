import { Controller, Get, Query } from '@nestjs/common';
import { GetRankingsQueryDto } from './dto/get-rankings-query.dto';
import { IActivitiesRankingService } from './activities-ranking.service.interface';

@Controller('rankings')
export class RankingsController {
  constructor(private readonly rankingsService: IActivitiesRankingService) {}

  @Get()
  getRankings(@Query() query: GetRankingsQueryDto) {
    return this.rankingsService.getRankingsForCity(query.city, query.country);
  }
}

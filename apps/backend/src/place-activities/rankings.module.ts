import { Module } from '@nestjs/common';
import { RankingsController } from './rankings.controller';
import { IActivityScoreService } from './weather-scoring.service.interface';
import { WeatherScoringService } from './weather-scoring.service';
import { IActivitiesRankingService } from './activities-ranking.service.interface';
import { ActivitiesRankingService } from './activities-ranking.service';
import { WeatherModule } from '../weather/weather.module';

@Module({
  imports: [WeatherModule],
  controllers: [RankingsController],
  providers: [
    {
      provide: IActivityScoreService,
      useClass: WeatherScoringService,
    },
    {
      provide: IActivitiesRankingService,
      useClass: ActivitiesRankingService,
    },
  ],
  exports: [IActivitiesRankingService],
})
export class RankingsModule {}

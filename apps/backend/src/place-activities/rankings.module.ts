import { Module } from '@nestjs/common';
import { PlaceInfoController } from './place-info.controller';
import { IActivityScoreService } from './weather-scoring.service.interface';
import { WeatherScoringService } from './weather-scoring.service';
import {
  IActivitiesRankingService,
  IPlaceService,
} from './activities-ranking.service.interface';
import { ActivitiesRankingService } from './activities-ranking.service';
import { PlaceService } from './place.service';
import { WeatherModule } from '../weather/weather.module';

@Module({
  imports: [WeatherModule],
  controllers: [PlaceInfoController],
  providers: [
    {
      provide: IActivityScoreService,
      useClass: WeatherScoringService,
    },
    {
      provide: IActivitiesRankingService,
      useClass: ActivitiesRankingService,
    },
    {
      provide: IPlaceService,
      useClass: PlaceService,
    },
  ],
  exports: [IActivitiesRankingService, IPlaceService],
})
export class RankingsModule {}

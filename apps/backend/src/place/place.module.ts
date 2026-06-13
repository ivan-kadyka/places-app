import { Module } from '@nestjs/common';
import { PlaceApiController } from './place-api.controller';
import { IActivityScoreService } from '../place-activities/weather-scoring.service.interface';
import { WeatherScoringService } from '../place-activities/weather-scoring.service';
import {
  IActivitiesRankingService,
  IPlaceService,
} from '../place-activities/activities-ranking.service.interface';
import { ActivitiesRankingService } from '../place-activities/activities-ranking.service';
import { PlaceService } from './place.service';
import { WeatherModule } from '../weather/weather.module';

@Module({
  imports: [WeatherModule],
  controllers: [PlaceApiController],
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

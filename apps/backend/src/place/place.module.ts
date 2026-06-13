import { Module } from '@nestjs/common';
import { PlaceApiController } from './place-api.controller';
import { PlaceApiResolver } from './place-api.resolver';
import { IActivityScoreService } from '../place-activities/weather-scoring.service.interface';
import { WeatherScoringService } from '../place-activities/weather-scoring.service';
import {
  IActivitiesRankingService,
  IPlaceService,
} from '../place-activities/activities-ranking.service.interface';
import { ActivitiesRankingService } from '../place-activities/activities-ranking.service';
import { PlaceService } from './place.service';
import { WeatherModule } from '../weather/weather.module';
import { IPlaceSearchService } from './search/place-search.service.interface';
import { PlaceSearchService } from './search/place-search.service';
import { OpenMeteoPlaceSearchService } from './search/open-meteo-place-search.service';

@Module({
  imports: [WeatherModule],
  controllers: [PlaceApiController],
  providers: [
    PlaceApiResolver,
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
    {
      provide: IPlaceSearchService,
      useClass: PlaceSearchService,
    },
    OpenMeteoPlaceSearchService,
  ],
  exports: [IActivitiesRankingService, IPlaceService, IPlaceSearchService],
})
export class RankingsModule {}

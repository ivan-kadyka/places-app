import { Module } from '@nestjs/common';
import { PlaceApiController } from './place-api.controller';
import { PlaceApiResolver } from './place-api.resolver';
import { IActivityScoreService } from '../place-activities/weather-scoring.service.interface';
import { WeatherScoringService } from '../place-activities/weather-scoring.service';
import { PlaceService } from './place.service';
import { WeatherModule } from '../weather/weather.module';
import { OpenMeteoPlaceSearchService } from './search/open-meteo-place-search.service';
import { IPlaceService } from 'src/place/place.service.interface';

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
      provide: IPlaceService,
      useClass: PlaceService,
    },
    OpenMeteoPlaceSearchService,
  ],
  exports: [IPlaceService],
})
export class PlaceModule {}

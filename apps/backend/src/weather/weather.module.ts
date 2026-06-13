import { Module } from '@nestjs/common';
import { OpenMeteoService } from './open-meteo.service';
import { WeatherCacheService } from './weather-cache.service';
import { IWeatherService } from './weather.service.interface';
import { WeatherService } from './weather.service';
import { OpenMeteoPlaceSearchService } from '../place/search/open-meteo-place-search.service';
import { IPlaceSearchService } from '../place/search/place-search.service.interface';
import { PlaceSearchService } from '../place/search/place-search.service';

@Module({
  providers: [
    OpenMeteoService,
    WeatherCacheService,
    {
      provide: IWeatherService,
      useClass: WeatherService,
    },
    OpenMeteoPlaceSearchService,
    PlaceSearchService,
    {
      provide: IPlaceSearchService,
      useClass: PlaceSearchService,
    },
  ],
  exports: [
    OpenMeteoService,
    WeatherCacheService,
    IWeatherService,
    IPlaceSearchService,
  ],
})
export class WeatherModule {}

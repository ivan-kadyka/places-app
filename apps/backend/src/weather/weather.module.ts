import { Module } from '@nestjs/common';
import { OpenMeteoService } from './open-meteo.service';
import { WeatherCacheService } from './weather-cache.service';
import { IWeatherService } from './weather.service.interface';
import { WeatherService } from './weather.service';
import { OpenMeteoPlaceSearchService } from './search/open-meteo-place-search.service';

@Module({
  providers: [
    OpenMeteoService,
    WeatherCacheService,
    {
      provide: IWeatherService,
      useClass: WeatherService,
    },
    OpenMeteoPlaceSearchService,
  ],
  exports: [
    OpenMeteoService,
    OpenMeteoPlaceSearchService,
    WeatherCacheService,
    IWeatherService
  ],
})
export class WeatherModule {}

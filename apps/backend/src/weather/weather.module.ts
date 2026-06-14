import { Module } from '@nestjs/common';
import { OpenMeteoService } from './open-meteo.service';
import { WeatherCacheService } from './weather-cache.service';
import { IWeatherForecastService } from './weather-forecaset.service.interface';
import { WeatherService } from './weather.service';
import { OpenMeteoPlaceSearchService } from './search/open-meteo-place-search.service';

@Module({
  providers: [
    OpenMeteoService,
    WeatherCacheService,
    {
      provide: IWeatherForecastService,
      useClass: WeatherService,
    },
    OpenMeteoPlaceSearchService,
  ],
  exports: [
    OpenMeteoService,
    OpenMeteoPlaceSearchService,
    WeatherCacheService,
    IWeatherForecastService
  ],
})
export class WeatherModule {}

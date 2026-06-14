import { Module } from '@nestjs/common';
import { OpenMeteoService } from './open-meteo/open-meteo.service';
import { WeatherForecastService } from './weather-forecast.service';
import { IWeatherForecastService } from './weather-forecast.service.interface';
import { OpenMeteoPlaceSearchService } from './open-meteo/search/open-meteo-place-search.service';

@Module({
  providers: [
    OpenMeteoService,
    WeatherForecastService,
    {
      provide: IWeatherForecastService,
      useClass: WeatherForecastService,
    },
    OpenMeteoPlaceSearchService,
  ],
  exports: [
    OpenMeteoService,
    OpenMeteoPlaceSearchService,
    IWeatherForecastService
  ],
})
export class WeatherModule {}

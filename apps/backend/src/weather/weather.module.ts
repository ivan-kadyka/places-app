import { Module } from '@nestjs/common';
import { OpenMeteoService } from './open-meteo.service';
import { WeatherCacheService } from './weather-cache.service';
import { IWeatherService } from './weather.service.interface';
import { WeatherService } from './weather.service';

@Module({
  providers: [
    OpenMeteoService,
    WeatherCacheService,
    {
      provide: IWeatherService,
      useClass: WeatherService,
    },
  ],
  exports: [OpenMeteoService, WeatherCacheService, IWeatherService],
})
export class WeatherModule {}

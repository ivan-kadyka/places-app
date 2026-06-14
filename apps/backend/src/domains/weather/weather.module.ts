import { Module } from '@nestjs/common';
import { OpenMeteoService } from './open-meteo/open-meteo.service';
import { WeatherForecastService } from './weather-forecast.service';
import { IWeatherForecastService } from './weather-forecast.service.interface';

@Module({
  providers: [
    OpenMeteoService,
    WeatherForecastService,
    {
      provide: IWeatherForecastService,
      useClass: WeatherForecastService,
    },
  ],
  exports: [
    IWeatherForecastService
  ],
})
export class WeatherModule {}

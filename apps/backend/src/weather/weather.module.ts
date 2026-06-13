import { Module } from '@nestjs/common';
import { OpenMeteoService } from './open-meteo.service';
import { WeatherCacheService } from './weather-cache.service';

@Module({
  providers: [OpenMeteoService, WeatherCacheService],
  exports: [OpenMeteoService, WeatherCacheService],
})
export class WeatherModule {}

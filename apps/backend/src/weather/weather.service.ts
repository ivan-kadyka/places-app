import { Injectable, NotFoundException } from '@nestjs/common';
import { IWeatherForecastService } from './weather-forecast.service.interface';
import { IWeatherForecast } from './models/weather-forecast';
import { WeatherCacheService } from './weather-cache.service';

@Injectable()
export class WeatherService implements IWeatherForecastService {
  constructor(
    private readonly weatherCache: WeatherCacheService,
  ) {}

  async getWeatherByPlace(place, dateRange): Promise<IWeatherForecast> {
    
    const {  openMeteoId} = place

    if (!openMeteoId) {
      throw new NotFoundException('Place entity has no openMeteoId');
    }

    const weather = await this.weatherCache.getWeatherForPlace(place);

    return {
      fetchedAt: weather.fetchedAt,
      expiresAt: weather.expiresAt,
      cacheHit: weather.cacheHit,
      daily: weather.daily,
    };
  }
}

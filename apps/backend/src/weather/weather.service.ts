import { Injectable, NotFoundException } from '@nestjs/common';
import { IWeatherForecastService } from './weather-forecaset.service.interface';
import { WeatherForecast } from './models/WeatherForecast';
import { WeatherCacheService } from './weather-cache.service';
import { IPlace } from "../place/models/IPlace";

@Injectable()
export class WeatherService implements IWeatherForecastService {
  constructor(
    private readonly weatherCache: WeatherCacheService,
  ) {}

  async getWeatherByPlace(
    place: IPlace,
  ): Promise<WeatherForecast> {
    
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

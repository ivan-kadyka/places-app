import { Injectable, NotFoundException } from '@nestjs/common';
import { IWeatherService, PlaceWeatherForecast } from './weather.service.interface';
import { WeatherCacheService } from './weather-cache.service';
import { IPlace } from "../place/models/IPlace";

@Injectable()
export class WeatherService implements IWeatherService {
  constructor(
    private readonly weatherCache: WeatherCacheService,
  ) {}

  async getWeatherByPlace(
    place: IPlace,
  ): Promise<PlaceWeatherForecast> {
    
    const {  openMeteoId} = place

    if (!openMeteoId) {
      throw new NotFoundException('Place entity has no openMeteoId');
    }

    const weather = await this.weatherCache.getWeatherForPlace(place);

    return {
      place,
      fetchedAt: weather.fetchedAt,
      expiresAt: weather.expiresAt,
      cacheHit: weather.cacheHit,
      daily: weather.daily,
    };
  }
}

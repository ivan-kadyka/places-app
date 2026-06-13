import { Injectable, NotFoundException } from '@nestjs/common';
import { IWeatherService, WeatherForecastResponse } from './weather.service.interface';
import { WeatherCacheService } from './weather-cache.service';
import { IPlace } from 'src/weather/weather.types';

@Injectable()
export class WeatherService implements IWeatherService {
  constructor(
    private readonly weatherCache: WeatherCacheService,
  ) {}

  async getWeatherByPlace(
    place: IPlace,
  ): Promise<WeatherForecastResponse> {
    

    const {  openMeteoId: locationId, name, countryCode, coordinate, timezone } = place
    const {latitude, longitude} = coordinate

    if (!locationId) {
      throw new NotFoundException('Place entity has no openMeteoId');
    }

    const weather = await this.weatherCache.getWeatherForLocation(
      locationId,
      latitude,
      longitude,
      timezone,
    );

    return {
      location: {
        id: locationId,
        name: name,
        countryCode: countryCode,
        latitude: latitude,
        longitude:longitude,
        timezone: timezone,
      },
      fetchedAt: weather.fetchedAt,
      expiresAt: weather.expiresAt,
      cacheHit: weather.cacheHit,
      daily: weather.daily,
    };
  }
}

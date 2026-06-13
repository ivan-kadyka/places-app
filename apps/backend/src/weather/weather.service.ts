import { Injectable, NotFoundException } from '@nestjs/common';
import { IWeatherService, WeatherForecastResponse } from './weather.service.interface';
import { OpenMeteoService } from './open-meteo.service';
import { WeatherCacheService } from './weather-cache.service';
import { IDBContext } from '../database/db-context.interface';

@Injectable()
export class WeatherService implements IWeatherService {
  constructor(
    private readonly dbContext: IDBContext,
    private readonly openMeteo: OpenMeteoService,
    private readonly weatherCache: WeatherCacheService,
  ) {}

  async getWeatherByPlace(
    city: string,
    countryCode?: string,
  ): Promise<WeatherForecastResponse> {
    const geocoding = await this.openMeteo.geocodeCity(city, countryCode);
    if (!geocoding) {
      throw new NotFoundException(`No location found for "${city}"`);
    }

    const { id: locationId, timezone } =
      await this.weatherCache.resolveLocation(geocoding);

    const location = await this.dbContext.locations.findById(locationId);
    if (!location) {
      throw new NotFoundException(`Location with ID "${locationId}" not found`);
    }

    const weather = await this.weatherCache.getWeatherForLocation(
      locationId,
      location.latitude,
      location.longitude,
      timezone,
    );

    return {
      location: {
        id: location.id,
        name: location.name,
        country: location.country,
        countryCode: location.countryCode,
        admin1: location.admin1,
        latitude: location.latitude,
        longitude: location.longitude,
        timezone: location.timezone,
      },
      fetchedAt: weather.fetchedAt,
      expiresAt: weather.expiresAt,
      cacheHit: weather.cacheHit,
      daily: weather.daily,
    };
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IDBContext } from '../database/db-context.interface';
import { OpenMeteoService } from './open-meteo.service';
import {
  DailyWeatherPoint,
  OpenMeteoDailyForecast,
} from './weather.types';
import {
  deserializeDailyForecast,
  serializeDailyForecast,
} from './forecast.utils';

export interface CachedWeather {
  locationId: string;
  fetchedAt: Date;
  expiresAt: Date;
  daily: DailyWeatherPoint[];
  cacheHit: boolean;
}

@Injectable()
export class WeatherCacheService {
  private readonly logger = new Logger(WeatherCacheService.name);
  private readonly cacheTtlMs: number;

  constructor(
    private readonly dbContext: IDBContext,
    private readonly openMeteo: OpenMeteoService,
    configService: ConfigService,
  ) {
    const ttlHours = Number(
      configService.get<string>('WEATHER_CACHE_TTL_HOURS') ?? 6,
    );
    this.cacheTtlMs = ttlHours * 60 * 60 * 1000;
  }



  async getWeatherForLocation(
    locationId: string,
    latitude: number,
    longitude: number,
    timezone: string,
  ): Promise<CachedWeather> {
    const now = new Date();
    const cached = await this.dbContext.weatherSnapshots.findLatestActive(
      locationId,
      now,
    );

    if (cached) {
      const daily = deserializeDailyForecast(
        cached.dailyData as unknown as OpenMeteoDailyForecast,
      );

      return {
        locationId,
        fetchedAt: cached.fetchedAt,
        expiresAt: cached.expiresAt,
        daily,
        cacheHit: true,
      };
    }

    return this.refreshWeather(locationId, latitude, longitude, timezone);
  }

  async refreshWeather(
    locationId: string,
    latitude: number,
    longitude: number,
    timezone: string,
  ): Promise<CachedWeather> {
    const forecast = await this.openMeteo.fetchForecast(
      latitude,
      longitude,
      timezone,
    );
    const daily = deserializeDailyForecast(forecast.daily);
    const fetchedAt = new Date();
    const expiresAt = new Date(fetchedAt.getTime() + this.cacheTtlMs);

    await this.dbContext.weatherSnapshots.create({
      placeId: locationId,
      fetchedAt,
      expiresAt,
      dailyData: serializeDailyForecast(daily),
    });

    this.logger.log(
      `Refreshed weather cache for location ${locationId} (expires ${expiresAt.toISOString()})`,
    );

    return {
      locationId,
      fetchedAt,
      expiresAt,
      daily,
      cacheHit: false,
    };
  }
}

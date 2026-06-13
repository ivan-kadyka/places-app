import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { IDBContext } from '../database/db-context.interface';
import { OpenMeteoService } from './open-meteo.service';
import {
  DailyWeatherPoint,
  GeocodingResult,
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

  async resolveLocation(
    geocoding: GeocodingResult,
  ): Promise<{ id: string; timezone: string }> {
    const location = await this.dbContext.places.upsert(
      geocoding.id,
      {
        name: geocoding.name,
        country: geocoding.country,
        countryCode: geocoding.country_code,
        admin1: geocoding.admin1 ?? null,
        latitude: geocoding.latitude,
        longitude: geocoding.longitude,
        elevation: geocoding.elevation,
        timezone: geocoding.timezone,
      },
      {
        name: geocoding.name,
        country: geocoding.country,
        countryCode: geocoding.country_code,
        admin1: geocoding.admin1 ?? null,
        latitude: geocoding.latitude,
        longitude: geocoding.longitude,
        elevation: geocoding.elevation,
        timezone: geocoding.timezone,
      },
    );

    return { id: location.id, timezone: location.timezone };
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

  @Cron(CronExpression.EVERY_6_HOURS)
  async refreshExpiredSnapshots(): Promise<void> {
    const now = new Date();
    const staleLocations = await this.dbContext.places.findStaleLocations(now);

    if (!staleLocations.length) {
      return;
    }

    this.logger.log(
      `Refreshing ${staleLocations.length} location(s) with stale weather data`,
    );

    for (const location of staleLocations) {
      try {
        await this.refreshWeather(
          location.id,
          location.latitude,
          location.longitude,
          location.timezone,
        );
      } catch (error) {
        this.logger.error(
          `Failed to refresh weather for ${location.name}: ${String(error)}`,
        );
      }
    }
  }
}

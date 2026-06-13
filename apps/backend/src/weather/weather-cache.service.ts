import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Prisma } from 'prisma/generated/client';
import { PrismaService } from '../prisma/prisma.service';
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
    private readonly prisma: PrismaService,
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
    const location = await this.prisma.location.upsert({
      where: { openMeteoId: geocoding.id },
      create: {
        openMeteoId: geocoding.id,
        name: geocoding.name,
        country: geocoding.country,
        countryCode: geocoding.country_code,
        admin1: geocoding.admin1 ?? null,
        latitude: geocoding.latitude,
        longitude: geocoding.longitude,
        elevation: geocoding.elevation,
        timezone: geocoding.timezone,
      },
      update: {
        name: geocoding.name,
        country: geocoding.country,
        countryCode: geocoding.country_code,
        admin1: geocoding.admin1 ?? null,
        latitude: geocoding.latitude,
        longitude: geocoding.longitude,
        elevation: geocoding.elevation,
        timezone: geocoding.timezone,
      },
    });

    return { id: location.id, timezone: location.timezone };
  }

  async getWeatherForLocation(
    locationId: string,
    latitude: number,
    longitude: number,
    timezone: string,
  ): Promise<CachedWeather> {
    const now = new Date();
    const cached = await this.prisma.weatherSnapshot.findFirst({
      where: {
        locationId,
        expiresAt: { gt: now },
      },
      orderBy: { fetchedAt: 'desc' },
    });

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

    await this.prisma.weatherSnapshot.create({
      data: {
        locationId,
        fetchedAt,
        expiresAt,
        dailyData: serializeDailyForecast(
          daily,
        ) as unknown as Prisma.InputJsonValue,
      },
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
    const staleLocations = await this.prisma.location.findMany({
      where: {
        snapshots: {
          none: {
            expiresAt: { gt: now },
          },
        },
      },
      include: {
        snapshots: {
          orderBy: { fetchedAt: 'desc' },
          take: 1,
        },
      },
    });

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

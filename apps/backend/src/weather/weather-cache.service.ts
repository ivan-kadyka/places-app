import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IDBContext } from '../database/db-context.interface';
import { OpenMeteoService } from './open-meteo.service';
import {
  DailyWeatherPoint,
  OpenMeteoDailyForecast,
} from './weather.types';
import { IPlace } from "../place/models/IPlace";
import {
  deserializeDailyForecast,
  serializeDailyForecast,
} from './forecast.utils';

export interface CachedWeather {
  placeId: string;
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



  async getWeatherForPlace(
    place: IPlace
  ): Promise<CachedWeather> {
    const now = new Date();


    const cached = await this.dbContext.weatherSnapshots.findLatestActive(
      place.id,
      now,
    );

    if (cached) {
      const daily = deserializeDailyForecast(
        cached.dailyData as unknown as OpenMeteoDailyForecast,
      );

      return {
        placeId: place.id,
        fetchedAt: cached.fetchedAt,
        expiresAt: cached.expiresAt,
        daily,
        cacheHit: true,
      };
    }

    return this.refreshWeather(place);
  }

  async refreshWeather(
    place: IPlace
  ): Promise<CachedWeather> {

    const {coordinate: {latitude, longitude}, timezone}  = place

    const forecast = await this.openMeteo.fetchForecast(
      latitude,
      longitude,
      timezone,
    );
    const daily = deserializeDailyForecast(forecast.daily);
    const fetchedAt = new Date();
    const expiresAt = new Date(fetchedAt.getTime() + this.cacheTtlMs);

    await this.dbContext.weatherSnapshots.create({
      placeId: place.id,
      fetchedAt,
      expiresAt,
      dailyData: serializeDailyForecast(daily),
    });

    this.logger.log(
      `Refreshed weather cache for location ${place.id} (expires ${expiresAt.toISOString()})`,
    );

    return {
      placeId: place.id,
      fetchedAt,
      expiresAt,
      daily,
      cacheHit: false,
    };
  }
}

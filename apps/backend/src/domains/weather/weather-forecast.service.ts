import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IDBContext } from '../../database/db-context.interface';
import { OpenMeteoService } from './open-meteo.service';
import { OpenMeteoDailyForecast} from './weather.types';
import { IPlace } from "../place/models/place";
import { deserializeDailyForecast, serializeDailyForecast} from './forecast.utils';
import { IDateRange } from 'src/types/date-range';
import { IWeatherForecastService } from 'src/domains/weather/weather-forecast.service.interface';
import { IWeatherForecast } from 'src/domains/weather/models/weather-forecast';


@Injectable()
export class WeatherForecastService implements IWeatherForecastService{
  private readonly logger = new Logger(WeatherForecastService.name);
  private readonly cacheTtlMs: number;

  constructor(
    private readonly dbContext: IDBContext,
    private readonly openMeteo: OpenMeteoService,
    configService: ConfigService,
  ) {
    const ttlHours = Number(configService.get<string>('WEATHER_CACHE_TTL_HOURS') ?? 6);
    this.cacheTtlMs = ttlHours * 60 * 60 * 1000;
  }

  async getWeatherByPlace(place: IPlace, dataRange: IDateRange): Promise<IWeatherForecast> {
    const now = new Date()

    const cached = await this.dbContext.weatherSnapshots.findLatestActive(place.id, now);

    if (cached) {

      const openMeteoData = cached.dailyData as OpenMeteoDailyForecast
      const daily = deserializeDailyForecast(openMeteoData)

      return {
        placeId: place.id,
        fetchedAt: cached.fetchedAt,
        expiresAt: cached.expiresAt,
        daily
      }
    }

    return this.refreshWeather(place, dataRange);
  }

  private async refreshWeather(place: IPlace, dataRange: IDateRange): Promise<IWeatherForecast> {

    const {coordinate: {latitude, longitude}, timezone}  = place

    const days = this.getDaysBetween(dataRange)

    const forecast = await this.openMeteo.fetchForecast(latitude, longitude, timezone, days)
    
    const daily = deserializeDailyForecast(forecast.daily);
    const fetchedAt = new Date();
    const expiresAt = new Date(fetchedAt.getTime() + this.cacheTtlMs);

    const serializedData = serializeDailyForecast(daily)

    await this.dbContext.weatherSnapshots.create({
      placeId: place.id,
      fetchedAt,
      expiresAt,
      dailyData: serializedData
    })

    this.logger.log(`Refreshed weather cache for location ${place.id} (expires ${expiresAt.toISOString()})`);

    return {
      placeId: place.id,
      fetchedAt,
      expiresAt,
      daily
    }
  }

  private getDaysBetween(range: IDateRange): number {
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.round((range.to.getTime() - range.from.getTime()) / msPerDay);
}
}

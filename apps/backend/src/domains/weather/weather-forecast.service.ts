import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IDBContext } from '../../database/db-context.interface';
import { OpenMeteoService } from './open-meteo.service';
import { IDayWeatherSnapshot, IWeatherSnapshot } from "./models/weather-snapshot";
import { IPlace } from "../place/models/place";
import { deserializeDailyForecast} from './forecast.utils';
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

  async getWeatherByPlace(place: IPlace, dateRange: IDateRange): Promise<IWeatherForecast> {
    const now = new Date()

    const cachedSnapshots = await this.dbContext.weatherDaySnapshots.search(place.id, dateRange);

    const daysInRange = this.getDaysInRange(dateRange);
    const cachedDates = new Set(cachedSnapshots.map(s => s.date.toISOString().split('T')[0]));
    const allDaysCached = daysInRange.every(date => cachedDates.has(date));

    if (allDaysCached && cachedSnapshots.length > 0) {
      const nowMs = now.getTime();
      const validSnapshots = cachedSnapshots.filter(s => {
        const ageMs = nowMs - s.updatedAt.getTime();
        return ageMs < this.cacheTtlMs;
      });

      if (validSnapshots.length === cachedSnapshots.length) {
        const daily: IDayWeatherSnapshot[] = validSnapshots.map(snapshot => {
          const data = snapshot.snapshot as IWeatherSnapshot;
          return {
            date: snapshot.date,
            temperatureMax: data.temperatureMax,
            temperatureMin: data.temperatureMin,
            precipitationSum: data.precipitationSum,
            rainSum: data.rainSum,
            snowfallSum: data.snowfallSum,
            windSpeedMax: data.windSpeedMax,
            windGustsMax: data.windGustsMax,
            sunshineDuration: data.sunshineDuration,
            weatherCode: data.weatherCode,
            precipitationProbabilityMax: data.precipitationProbabilityMax,
          };
        }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        const oldestUpdatedAt = new Date(Math.min(...validSnapshots.map(s => s.updatedAt.getTime())));
        const expiresAt = new Date(oldestUpdatedAt.getTime() + this.cacheTtlMs);

        return {
          placeId: place.id,
          fetchedAt: oldestUpdatedAt,
          expiresAt,
          days: daily
        };
      }
    }

    return this.refreshWeather(place, dateRange);
  }

  private async refreshWeather(place: IPlace, dateRange: IDateRange): Promise<IWeatherForecast> {
    const {coordinate: {latitude, longitude}, timezone}  = place;

    const days = this.getDaysBetween(dateRange);
    const forecast = await this.openMeteo.fetchForecast(latitude, longitude, timezone, days);
    const daily = deserializeDailyForecast(forecast.daily);
    const fetchedAt = new Date();
    const expiresAt = new Date(fetchedAt.getTime() + this.cacheTtlMs);

    await this.dbContext.weatherDaySnapshots.delete(place.id, dateRange);

    await this.dbContext.weatherDaySnapshots.createMany(
      daily.map(dayPoint => ({
        providerType: 'open-meteo',
        date: dayPoint.date,
        snapshot: dayPoint,
        placeId: place.id,
      }))
    );

    this.logger.log(`Refreshed weather cache for location ${place.id} (expires ${expiresAt.toISOString()})`);

    return {
      placeId: place.id,
      fetchedAt,
      expiresAt,
      days: daily
    };
  }

  private getDaysBetween(range: IDateRange): number {
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.round((range.to.getTime() - range.from.getTime()) / msPerDay);
  }

  private getDaysInRange(range: IDateRange): string[] {
    const days: string[] = [];
    const current = new Date(range.from);
    const end = new Date(range.to);
    while (current <= end) {
      days.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }
    return days;
  }
}

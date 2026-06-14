import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IDBContext } from '../../database/db-context.interface';
import { OpenMeteoService } from './open-meteo/open-meteo.service';
import { IDayWeatherSnapshot, IWeatherSnapshot } from "./models/weather-snapshot";
import { IPlace } from "../place/models/place";
import { deserializeDailyForecast} from './open-meteo/utils/forecast.utils';
import { IDateRange } from 'src/types/date-range';
import { IWeatherForecastService } from 'src/domains/weather/weather-forecast.service.interface';
import { IWeatherForecast } from 'src/domains/weather/models/weather-forecast';
import { isSameDay } from 'date-fns';
import { getDaysBetween, getDaysInRange } from 'src/utils/date-utils';
import { CreateWeatherDaySnapshot } from 'src/database/repositories/weather-day-snapshot.repository.interface';
import { WeatherDaySnapshotEntity } from 'src/database/entities/weather-day-snapshot.entity';

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
  
    const cachedSnapshots = await this.dbContext.weatherDaySnapshots.search(place.id, dateRange)
    const daysInRange = getDaysInRange(dateRange)

    const validSnapshots = this.getValidSnapshots(cachedSnapshots, daysInRange);

      if (validSnapshots.length === daysInRange.length) {
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
          }
        }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

        const oldestUpdatedAt = new Date(Math.min(...validSnapshots.map(s => s.updatedAt.getTime())))
        const expiresAt = new Date(oldestUpdatedAt.getTime() + this.cacheTtlMs);

        return {
          placeId: place.id,
          fetchedAt: oldestUpdatedAt,
          expiresAt,
          days: daily
        }
      }
  
    return this.refreshWeather(place, dateRange);
  }

  private async refreshWeather(place: IPlace, dateRange: IDateRange): Promise<IWeatherForecast> {
    const {coordinate: {latitude, longitude}, timezone}  = place;

    const days = getDaysBetween(dateRange);
    const forecast = await this.openMeteo.fetchForecast(latitude, longitude, timezone, days);
    const daily = deserializeDailyForecast(forecast.daily);
    const fetchedAt = new Date();
    const expiresAt = new Date(fetchedAt.getTime() + this.cacheTtlMs);

    await this.dbContext.weatherDaySnapshots.delete(place.id, dateRange);

    await this.dbContext.weatherDaySnapshots.createMany(
      daily.map(dayPoint => (this.convertToCreateWeatherDaySnapshot(place, dayPoint)))
    )

    this.logger.log(`Refreshed weather cache for location ${place.id} (updatedAt ${fetchedAt.toISOString()})`);

    return {
      placeId: place.id,
      fetchedAt,
      expiresAt,
      days: daily
    };
  }

  private getValidSnapshots(cachedSnapshots: WeatherDaySnapshotEntity[], daysInRange: Date[]): WeatherDaySnapshotEntity[] {
    const now = new Date()

    const allDaysCached = daysInRange.every(dayInRange => 
      cachedSnapshots.some(cached => isSameDay(dayInRange, cached.date))
    )

    if (allDaysCached && cachedSnapshots.length > 0) {
      const nowMs = now.getTime();
      const validSnapshots = cachedSnapshots.filter(s => {
        const deltaAgeMs = nowMs - s.updatedAt.getTime()
        return deltaAgeMs < this.cacheTtlMs
      })

      return validSnapshots
   } 

  return []
 }

  private convertToCreateWeatherDaySnapshot(place: IPlace, weatherSnapshot: IDayWeatherSnapshot): CreateWeatherDaySnapshot {
    
    const {date, ...snapshot} = weatherSnapshot;

    return {
      providerType: 'open-meteo',
      date,
      snapshot: snapshot,
      placeId: place.id,
    }
  }
}

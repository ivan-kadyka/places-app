import { DailyWeatherPoint } from 'src/weather/weather.types';

export interface IWeatherForecast {
  fetchedAt: Date;
  expiresAt: Date;
  cacheHit: boolean;
  daily: DailyWeatherPoint[];
}

import { DailyWeatherPoint } from 'src/weather/weather.types';

export interface WeatherForecast {
  fetchedAt: Date;
  expiresAt: Date;
  cacheHit: boolean;
  daily: DailyWeatherPoint[];
}

import { DailyWeatherPoint } from './weather.types';

export interface WeatherForecastResponse {
  location: {
    id: string;
    name: string;
    country: string;
    countryCode: string;
    admin1: string | null;
    latitude: number;
    longitude: number;
    timezone: string;
  };
  fetchedAt: Date;
  expiresAt: Date;
  cacheHit: boolean;
  daily: DailyWeatherPoint[];
}

export abstract class IWeatherService {
  abstract getWeatherForCity(
    city: string,
    countryCode?: string,
  ): Promise<WeatherForecastResponse>;
}

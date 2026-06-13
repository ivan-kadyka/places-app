import { DailyWeatherPoint } from './weather.types';
import { IPlace } from "../place/models/IPlace";

export interface WeatherForecastResponse {
  location: {
    id: string;
    name: string;
    countryCode: string;
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
  abstract getWeatherByPlace(
    place: IPlace
  ): Promise<WeatherForecastResponse>;
}

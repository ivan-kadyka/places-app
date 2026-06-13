import { DailyWeatherPoint } from './weather.types';
import { IPlace } from "../place/models/IPlace";

export interface PlaceWeatherForecast {
  place: IPlace;
  fetchedAt: Date;
  expiresAt: Date;
  cacheHit: boolean;
  daily: DailyWeatherPoint[];
}

export abstract class IWeatherService {
  abstract getWeatherByPlace(
    place: IPlace
  ): Promise<PlaceWeatherForecast>;
}

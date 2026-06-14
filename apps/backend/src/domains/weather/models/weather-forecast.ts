import { PlaceId } from 'src/domains/place/models/place';
import { DailyWeatherPoint } from 'src/domains/weather/weather.types';

export interface IWeatherForecast {
  placeId: PlaceId
  fetchedAt: Date
  expiresAt: Date
  daily: DailyWeatherPoint[]
}

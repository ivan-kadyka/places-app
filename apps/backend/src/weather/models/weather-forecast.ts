import { PlaceId } from 'src/place/models/place';
import { DailyWeatherPoint } from 'src/weather/weather.types';

export interface IWeatherForecast {
  placeId: PlaceId
  fetchedAt: Date
  expiresAt: Date
  daily: DailyWeatherPoint[]
}

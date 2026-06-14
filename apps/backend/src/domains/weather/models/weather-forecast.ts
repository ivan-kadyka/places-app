import { PlaceId } from 'src/domains/place/models/place';
import { IDayWeatherSnapshot } from "./weather-snapshot";

export interface IWeatherForecast {
  placeId: PlaceId
  fetchedAt: Date
  expiresAt: Date
  days: IDayWeatherSnapshot[]
}

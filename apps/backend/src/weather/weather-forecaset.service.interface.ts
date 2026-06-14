import { IPlace } from "../place/models/IPlace";
import { WeatherForecast } from 'src/weather/models/WeatherForecast';

export abstract class IWeatherForecastService {
  abstract getWeatherByPlace(place: IPlace): Promise<WeatherForecast>;
}

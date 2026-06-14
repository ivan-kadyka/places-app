import { IDateRange } from "src/types/date-range";
import { IPlace } from "../place/models/place";
import { IWeatherForecast } from 'src/weather/models/weather-forecast';

export abstract class IWeatherForecastService {
  abstract getWeatherByPlace( place: IPlace, dateRange?: IDateRange): Promise<IWeatherForecast>;
}

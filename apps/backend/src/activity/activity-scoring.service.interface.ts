import { IPlace } from 'src/place/models/place';
import { IActivity } from 'src/activity/models/activity';
import { IWeatherForecast } from 'src/weather/models/weather-forecast';

export abstract class IActivityScoreService {
  abstract getActivities(place: IPlace, weatherForecast: IWeatherForecast): IActivity[];
}

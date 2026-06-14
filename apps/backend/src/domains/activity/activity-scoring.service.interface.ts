import { IPlace } from 'src/domains/place/models/place';
import { IActivity } from 'src/domains/activity/models/activity';
import { IWeatherForecast } from 'src/domains/weather/models/weather-forecast';

export abstract class IActivityScoreService {
  abstract getActivities(place: IPlace, weatherForecast: IWeatherForecast): IActivity[];
}

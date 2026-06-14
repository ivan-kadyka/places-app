import { IPlace } from 'src/place/models/place';
import {
  DailyWeatherPoint,
} from '../weather/weather.types';
import { IActivity } from 'src/activity/models/activity';

export abstract class IActivityScoreService {
  abstract getActivities(place: IPlace, weather: DailyWeatherPoint): IActivity[];
}

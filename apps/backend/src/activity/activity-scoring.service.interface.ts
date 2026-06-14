import { IPlace } from 'src/place/models/IPlace';
import {
  DailyWeatherPoint,
  RecommendationLevel,
} from '../weather/weather.types';
import { ActivityType } from "src/activity/models/ActivityType";

export interface IActivityScore {
  type: ActivityType;
  score: {
    type: RecommendationLevel;
    percentage: number;
  };
}

export abstract class IActivityScoreService {
  abstract getActivities(place: IPlace, weather: DailyWeatherPoint): IActivityScore[];
}

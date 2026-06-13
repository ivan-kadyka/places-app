import {
  DailyWeatherPoint,
  RecommendationLevel,
} from '../weather/weather.types';
import { ActivityType } from "src/place/models/ActivityType";

export interface IActivityScore {
  type: ActivityType;
  score: {
    type: RecommendationLevel;
    percentage: number;
  };
}

export abstract class IActivityScoreService {
  abstract scoreActivities(
    location: { latitude: number; longitude: number; timezone: string },
    weather: DailyWeatherPoint,
  ): IActivityScore[];
}

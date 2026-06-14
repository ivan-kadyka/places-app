import { Injectable } from '@nestjs/common';
import { IActivityScoreService } from './activity-scoring.service.interface';
import { RecommendationLevel } from "src/domains/activities/models/recommendation-level";
import { aggregateForecast, scoreIndoorSightseeing, scoreOutdoorSightseeing, scoreSkiing, scoreSurfing } from './activity-scoring';
import { ACTIVITIES, ActivityType } from 'src/domains/activities/models/activity-type';
import { IPlace } from 'src/domains/place/models/place';
import { IActivity } from 'src/domains/activities/models/activity';
import { IWeatherForecast } from 'src/domains/weather/models/weather-forecast';
import { IWeatherSnapshot } from 'src/domains/weather/models/weather-snapshot';

@Injectable()
export class ActivityScoringService implements IActivityScoreService {

  async getActivities(place: IPlace, weatherForecast: IWeatherForecast): Promise<IActivity[]> {
  const weather = aggregateForecast(weatherForecast.days);

  const activities = ACTIVITIES.map((activityType) => {
    const score = this.getActivityScore(place, weather, activityType);
    const percentage = Math.round(score);
    return {
      type: activityType,
      score: {
        percentage,
        level: this.getRecommendationLevel(percentage),
      },
    };
  });

  return await Promise.resolve(activities);
}

 private getActivityScore(place: IPlace, weather: IWeatherSnapshot, activityType: ActivityType) : number {
    switch (activityType) {
      case ActivityType.SKIING:
        return scoreSkiing(place, weather);
      case ActivityType.SURFING:
        return scoreSurfing(place, weather);
      case ActivityType.OUTDOOR_SIGHTSEEING:
        return scoreOutdoorSightseeing(weather);
      case ActivityType.INDOOR_SIGHTSEEING:
        return scoreIndoorSightseeing(weather);
      default:
        return 0;
    }
 }
  

  private getRecommendationLevel(score: number): RecommendationLevel {
    if (score < 20) return RecommendationLevel.Unsuitable;
    if (score < 40) return RecommendationLevel.Poor;
    if (score < 60) return RecommendationLevel.Average;
    if (score < 80) return RecommendationLevel.Good;
    return RecommendationLevel.Ideal;
  }
}

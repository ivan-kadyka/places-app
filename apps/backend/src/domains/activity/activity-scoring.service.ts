import { Injectable } from '@nestjs/common';
import { IActivityScoreService } from './activity-scoring.service.interface';
import { RecommendationLevel } from "src/domains/activity/models/recommendation-level";
import { aggregateForecast, scoreIndoorSightseeing, scoreOutdoorSightseeing, scoreSkiing, scoreSurfing } from './activity-scoring';
import { ActivityType } from 'src/domains/activity/models/activity-type';
import { IPlace } from 'src/domains/place/models/place';
import { IActivity } from 'src/domains/activity/models/activity';
import { IWeatherForecast } from 'src/domains/weather/models/weather-forecast';

@Injectable()
export class ActivityScoringService implements IActivityScoreService {

  async getActivities(place: IPlace, weatherForecast: IWeatherForecast): Promise<IActivity[]> {
    const weatherPoint = aggregateForecast(weatherForecast.days);

  const scores: Record<ActivityType, number> = {
    [ActivityType.SKIING]: scoreSkiing(place, weatherPoint),
    [ActivityType.SURFING]: scoreSurfing(place, weatherPoint),
    [ActivityType.OUTDOOR_SIGHTSEEING]: scoreOutdoorSightseeing(weatherPoint),
    [ActivityType.INDOOR_SIGHTSEEING]: scoreIndoorSightseeing(weatherPoint),
  }

  const activities = Object.entries(scores).map(([type, scoreValue]) => {
    const percentage = Math.round(scoreValue);
    return {
      type: type as ActivityType,
      score: {
        percentage,
        level: this.getRecommendationLevel(percentage),
      },
    };
  });

  return await Promise.resolve(activities);
}

  private getRecommendationLevel(score: number): RecommendationLevel {
    if (score < 20) return RecommendationLevel.Unsuitable;
    if (score < 40) return RecommendationLevel.Poor;
    if (score < 60) return RecommendationLevel.Average;
    if (score < 80) return RecommendationLevel.Good;
    return RecommendationLevel.Ideal;
  }
}

import { Injectable } from '@nestjs/common';
import { IActivityScoreService } from './activity-scoring.service.interface';
import { DailyWeatherPoint } from '../weather/weather.types';
import { RecommendationLevel } from "src/activity/models/recommendation-level";
import { activityScorers } from './activity-scoring';
import { ACTIVITIES } from 'src/activity/models/activity-type';
import { IPlace } from 'src/place/models/place';
import { IActivity } from 'src/activity/models/activity';

@Injectable()
export class ActivityScoringService implements IActivityScoreService {
  getActivities(
    place: IPlace,
    weather: DailyWeatherPoint,
  ): IActivity[] {
    return ACTIVITIES.map((activityType): IActivity => {
      const scorer = activityScorers[activityType];
      const rawScore = scorer(weather);
      
      const level = this.getRecommendationLevel(rawScore);
      
      return {
        type: activityType,
        score: {
          level: level,
          percentage: Math.round(rawScore * 10) / 10,
        },
      };
    });
  }

  private getRecommendationLevel(score: number): RecommendationLevel {
    if (score < 20) return RecommendationLevel.Unsuitable;
    if (score < 40) return RecommendationLevel.Poor;
    if (score < 60) return RecommendationLevel.Average;
    if (score < 80) return RecommendationLevel.Good;
    return RecommendationLevel.Ideal;
  }
}

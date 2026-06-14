import { Injectable } from '@nestjs/common';
import { IActivityScoreService, IActivityScore } from './activity-scoring.service.interface';
import { DailyWeatherPoint, RecommendationLevel } from '../weather/weather.types';
import { activityScorers } from './activity-scoring';
import { ACTIVITIES } from 'src/activity/models/ActivityType';
import { IPlace } from 'src/place/models/IPlace';

@Injectable()
export class ActivityScoringService implements IActivityScoreService {
  getActivities(
    place: IPlace,
    weather: DailyWeatherPoint,
  ): IActivityScore[] {
    return ACTIVITIES.map((activity): IActivityScore => {
      const scorer = activityScorers[activity];
      const rawScore = scorer(weather);
      
      const level = this.getRecommendationLevel(rawScore);
      
      return {
        type: activity,
        score: {
          type: level,
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

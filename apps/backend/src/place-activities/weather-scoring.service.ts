import { Injectable } from '@nestjs/common';
import { IActivityScoreService, IActivityScore } from './weather-scoring.service.interface';
import { DailyWeatherPoint, RecommendationLevel, ACTIVITIES } from '../weather/weather.types';
import { activityScorers } from './activity-scoring';

@Injectable()
export class WeatherScoringService implements IActivityScoreService {
  scoreActivities(
    location: { latitude: number; longitude: number; timezone: string },
    weather: DailyWeatherPoint,
  ): IActivityScore[] {
    return ACTIVITIES.map((activity) => {
      const scorer = activityScorers[activity];
      const rawScore = scorer(weather);
      
      const level = this.getRecommendationLevel(rawScore);
      
      return {
        name: activity,
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

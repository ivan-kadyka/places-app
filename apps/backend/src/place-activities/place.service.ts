import { Injectable } from '@nestjs/common';
import {
  IPlaceService,
  IPlaceActivitiesParams,
  IPlaceActivitiesResult,
  IActivity,
} from './activities-ranking.service.interface';
import { IWeatherService } from '../weather/weather.service.interface';
import { IActivityScoreService } from './weather-scoring.service.interface';
import { ACTIVITIES, RecommendationLevel } from '../weather/weather.types';

@Injectable()
export class PlaceService implements IPlaceService {
  constructor(
    private readonly weatherService: IWeatherService,
    private readonly scoringService: IActivityScoreService,
  ) {}

  async getActivities(
    params: IPlaceActivitiesParams,
  ): Promise<IPlaceActivitiesResult> {
    const weatherForecast = await this.weatherService.getWeatherByPlace(
      params.place,
    );

    const activities: IActivity[] = ACTIVITIES.map((activityType) => {
      const scoreResults = weatherForecast.daily.map((day) =>
        this.scoringService.scoreActivities(weatherForecast.location, day),
      );

      const avgPercentage =
        scoreResults.reduce((sum, dayScores) => {
          const activityScore = dayScores.find((s) => s.type === activityType);
          return sum + (activityScore ? activityScore.score.percentage : 0);
        }, 0) / scoreResults.length;

      const avgLevel =
        scoreResults.reduce((sum, dayScores) => {
          const activityScore = dayScores.find((s) => s.type === activityType);
          return (
            sum +
            (activityScore
              ? activityScore.score.type
              : RecommendationLevel.Unsuitable)
          );
        }, 0) / scoreResults.length;

      const roundedLevel = Math.max(
        RecommendationLevel.Unsuitable,
        Math.min(RecommendationLevel.Ideal, Math.round(avgLevel)),
      );

      return {
        id: activityType,
        name: activityType,
        score: {
          type: roundedLevel,
          percentage: Math.round(avgPercentage),
        },
      };
    });

    const fromDate = new Date(weatherForecast.daily[0].date);
    const toDate = new Date(
      weatherForecast.daily[weatherForecast.daily.length - 1].date,
    );

    return {
      id: weatherForecast.location.id.toString(),
      place: weatherForecast.location.name,
      dateRange: {
        from: fromDate,
        to: toDate,
      },
      activities,
    };
  }
}

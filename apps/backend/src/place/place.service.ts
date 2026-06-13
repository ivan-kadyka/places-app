import { Injectable, NotFoundException } from '@nestjs/common';
import {
  IPlaceService,
  IPlaceActivitiesParams,
  IPlaceActivitiesResult,
  IActivity,
} from '../place-activities/activities-ranking.service.interface';
import { IWeatherService } from '../weather/weather.service.interface';
import { IActivityScoreService } from '../place-activities/weather-scoring.service.interface';
import { ACTIVITIES, RecommendationLevel } from '../weather/weather.types';
import { IPlaceSearchService } from 'src/place/search/place-search.service.interface';

@Injectable()
export class PlaceService implements IPlaceService {
  constructor(
    private readonly weatherService: IWeatherService,
    private readonly scoringService: IActivityScoreService,
    private readonly searchService: IPlaceSearchService,
  ) {}

  async getActivities(
    params: IPlaceActivitiesParams,
  ): Promise<IPlaceActivitiesResult> {

    const placeName = params.place

    const searchResult = await this.searchService.search(placeName, 1);

    const place = searchResult[0]
    
    if (!place) {
      throw new NotFoundException(`Place ${placeName} not found`);
    }

    const weatherForecast = await this.weatherService.getWeatherByPlace(
      place
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

import { Injectable } from '@nestjs/common';
import { IActivitiesRankingService } from './activities-ranking.service.interface';
import { IWeatherService } from '../weather/weather.service.interface';
import { IActivityScoreService } from './weather-scoring.service.interface';
import {
  ACTIVITIES,
  Activity,
  ActivityDayRanking,
  ActivityRanking,
  DailyWeatherPoint,
  RecommendationLevel,
  RankingsResponse,
} from '../weather/weather.types';

@Injectable()
export class ActivitiesRankingService implements IActivitiesRankingService {
  constructor(
    private readonly weatherService: IWeatherService,
    private readonly scoringService: IActivityScoreService,
  ) {}

  async getRankingsForCity(
    city: string,
    countryCode?: string,
  ): Promise<RankingsResponse> {
    const weatherForecast = await this.weatherService.getWeatherForCity(city, countryCode);
    const { location, daily, fetchedAt, expiresAt, cacheHit } = weatherForecast;

    const rankings = ACTIVITIES.map((activity) =>
      this.rankDaysForActivity(activity, daily, location),
    );

    return {
      location: {
        name: location.name,
        country: location.country,
        countryCode: location.countryCode,
        admin1: location.admin1,
        latitude: location.latitude,
        longitude: location.longitude,
        timezone: location.timezone,
      },
      forecastFetchedAt: fetchedAt.toISOString(),
      forecastExpiresAt: expiresAt.toISOString(),
      cacheHit,
      rankings,
    };
  }

  private rankDaysForActivity(
    activity: Activity,
    days: DailyWeatherPoint[],
    location: { latitude: number; longitude: number; timezone: string },
  ): ActivityRanking {
    const scoredDays = days.map((day) => {
      const scores = this.scoringService.scoreActivities(location, day);
      const activityScore = scores.find((s) => s.name === activity);

      return {
        date: day.date,
        score: activityScore ? activityScore.score.percentage : 0,
        recommendationLevel: activityScore ? activityScore.score.type : RecommendationLevel.Unsuitable,
        weatherCode: day.weatherCode,
        temperatureMax: day.temperatureMax,
        temperatureMin: day.temperatureMin,
        precipitationSum: day.precipitationSum,
      };
    });

    scoredDays.sort((a, b) => b.score - a.score || a.date.localeCompare(b.date));

    const rankedDays: ActivityDayRanking[] = scoredDays.map((day, index) => ({
      date: day.date,
      rank: index + 1,
      score: day.score,
      recommendationLevel: day.recommendationLevel,
      weatherCode: day.weatherCode,
      temperatureMax: day.temperatureMax,
      temperatureMin: day.temperatureMin,
      precipitationSum: day.precipitationSum,
    }));

    rankedDays.sort((a, b) => a.date.localeCompare(b.date));

    return {
      activity,
      days: rankedDays,
    };
  }
}

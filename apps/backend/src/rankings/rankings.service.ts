import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WeatherCacheService } from '../weather/weather-cache.service';
import { OpenMeteoService } from '../weather/open-meteo.service';
import {
  ACTIVITIES,
  Activity,
  ActivityDayRanking,
  ActivityRanking,
  RankingsResponse,
} from '../weather/weather.types';
import { activityScorers } from './activity-scoring';

@Injectable()
export class RankingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly openMeteo: OpenMeteoService,
    private readonly weatherCache: WeatherCacheService,
  ) {}

  async getRankingsForCity(
    city: string,
    countryCode?: string,
  ): Promise<RankingsResponse> {
    const geocoding = await this.openMeteo.geocodeCity(city, countryCode);
    if (!geocoding) {
      throw new NotFoundException(`No location found for "${city}"`);
    }

    const { id: locationId, timezone } =
      await this.weatherCache.resolveLocation(geocoding);

    const location = await this.prisma.location.findUniqueOrThrow({
      where: { id: locationId },
    });

    const weather = await this.weatherCache.getWeatherForLocation(
      locationId,
      location.latitude,
      location.longitude,
      timezone,
    );

    const rankings = ACTIVITIES.map((activity) =>
      this.rankDaysForActivity(activity, weather.daily),
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
      forecastFetchedAt: weather.fetchedAt.toISOString(),
      forecastExpiresAt: weather.expiresAt.toISOString(),
      cacheHit: weather.cacheHit,
      rankings,
    };
  }

  private rankDaysForActivity(
    activity: Activity,
    days: Parameters<typeof activityScorers.skiing>[0][],
  ): ActivityRanking {
    const scorer = activityScorers[activity];

    const scoredDays = days.map((day) => ({
      date: day.date,
      score: scorer(day),
      weatherCode: day.weatherCode,
      temperatureMax: day.temperatureMax,
      temperatureMin: day.temperatureMin,
      precipitationSum: day.precipitationSum,
    }));

    scoredDays.sort((a, b) => b.score - a.score || a.date.localeCompare(b.date));

    const rankedDays: ActivityDayRanking[] = scoredDays.map((day, index) => ({
      date: day.date,
      rank: index + 1,
      score: Math.round(day.score * 10) / 10,
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

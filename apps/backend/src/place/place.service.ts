import { Injectable, NotFoundException } from '@nestjs/common';
import { IActivity } from 'src/place/models/IActivity';
import { IPlaceDetails } from 'src/place/models/IPlaceDetails';
import { IWeatherService } from '../weather/weather.service.interface';
import { IActivityScoreService } from './details/activity-scrore/activity-scoring.service.interface';
import { RecommendationLevel } from '../weather/weather.types';
import { ACTIVITIES } from 'src/place/models/ActivityType';
import { IPlaceDetailsParams, IPlaceService, ISearchPlacesParams } from 'src/place/place.service.interface';
import { IPlace } from 'src/place/models/IPlace';
import { IDBContext } from 'src/database/db-context.interface';
import { OpenMeteoPlaceSearchService } from 'src/weather/search/open-meteo-place-search.service';

@Injectable()
export class PlaceService implements IPlaceService {
  constructor(
    private readonly weatherService: IWeatherService,
    private readonly scoringService: IActivityScoreService,
    private readonly dbContext: IDBContext,
    private readonly openMeteoSearchService: OpenMeteoPlaceSearchService,
  ) {}

  
  async search(params : ISearchPlacesParams): Promise<IPlace[]> {
  
      const {name: query, count} = params;
      // 1. Try database first
      const places = await this.dbContext.places.search({ name: query, count });
  
      if (places.length > 0) {
        return places;
      }
  
      // 2. If no results, use OpenMeteo
      const openMeteoResults = await this.openMeteoSearchService.search(params);
      if (openMeteoResults.length === 0) {
        return [];
      }
  
      // 3. Save to database
      const savedPlaces = await this.dbContext.places.save(openMeteoResults);
  
      return savedPlaces;
    }

  async getDetails(
    params: IPlaceDetailsParams,
  ): Promise<IPlaceDetails> {

    const placeName = params.name

    const searchResult = await this.search({ name: placeName, count: 1 });

    const place = searchResult[0]
    
    if (!place) {
      throw new NotFoundException(`Place ${placeName} not found`);
    }

    const weatherForecast = await this.weatherService.getWeatherByPlace(
      place
    );

    const activities: IActivity[] = ACTIVITIES.map((activityType) => {
      const scoreResults = weatherForecast.daily.map((day) =>
        this.scoringService.scoreActivities(weatherForecast.place, day),
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

     activities.sort((a, b) => b.score.percentage - a.score.percentage)

    return {
      id: weatherForecast.place.id,
      placeName: weatherForecast.place.name,
      dateRange: {
        from: fromDate,
        to: toDate,
      },
      activities,
    };
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { IActivity } from 'src/activity/models/activity';
import { IPlaceDetails } from 'src/place/models/place-details';
import { IActivityScoreService } from 'src/activity/activity-scoring.service.interface';
import { RecommendationLevel } from "src/activity/models/recommendation-level";
import { ACTIVITIES } from 'src/activity/models/activity-type';
import { IPlaceDetailsParams, IPlaceService, ISearchPlacesParams } from 'src/place/place.service.interface';
import { IPlace } from 'src/place/models/place';
import { IDBContext } from 'src/database/db-context.interface';
import { OpenMeteoPlaceSearchService } from 'src/weather/search/open-meteo-place-search.service';
import { IWeatherForecastService } from 'src/weather/weather-forecaset.service.interface';

@Injectable()
export class PlaceService implements IPlaceService {
  constructor(
    private readonly weatherService: IWeatherForecastService,
    private readonly activityScoringService: IActivityScoreService,
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

  async getDetails(params: IPlaceDetailsParams): Promise<IPlaceDetails> {

    const placeName = params.name

    const searchResult = await this.search({ name: placeName, count: 1 });

    const place = searchResult[0]
    
    if (!place) {
      throw new NotFoundException(`Place ${placeName} not found`);
    }

    const weatherForecast = await this.weatherService.getWeatherByPlace(place);

    const activities: IActivity[] = ACTIVITIES.map((activityType) => {
      const scoreResults = weatherForecast.daily.map((day) =>
        this.activityScoringService.getActivities(place, day),
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
              ? activityScore.score.level
              : RecommendationLevel.Unsuitable)
          );
        }, 0) / scoreResults.length;

      const roundedLevel = Math.max(
        RecommendationLevel.Unsuitable,
        Math.min(RecommendationLevel.Ideal, Math.round(avgLevel)),
      );

      const activity: IActivity =  {
        type: activityType,
        score: {
          level: roundedLevel,
          percentage: Math.round(avgPercentage),
        },
      }

      return activity
    });

    const fromDate = new Date(weatherForecast.daily[0].date);
    const toDate = new Date( weatherForecast.daily[weatherForecast.daily.length - 1].date);

    activities.sort((a, b) => b.score.percentage - a.score.percentage)

    return {
      id: place.id,
      placeName: place.name,
      dateRange: {
        from: fromDate,
        to: toDate,
      },
      activities,
    };
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { IPlaceDetails } from 'src/domains/place/models/place-details';
import { IActivityScoreService } from 'src/domains/activities/activity-scoring.service.interface';
import { IPlaceDetailsParams, IPlaceService, ISearchPlacesParams } from 'src/domains/place/place.service.interface';
import { IPlace } from 'src/domains/place/models/place';
import { IDBContext } from 'src/database/db-context.interface';
import { IWeatherForecastService } from 'src/domains/weather/weather-forecast.service.interface';
import { getDateRangeOrNextWeek } from 'src/utils/date-utils';
import { IPlaceSearchService } from 'src/domains/place/search/place-search.service.interface';

@Injectable()
export class PlaceService implements IPlaceService {
  constructor(
    private readonly weatherService: IWeatherForecastService,
    private readonly activityScoringService: IActivityScoreService,
    private readonly dbContext: IDBContext,
    private readonly placeSearchService: IPlaceSearchService,
  ) {}

  
  async search(params : ISearchPlacesParams): Promise<IPlace[]> {
  
      const {name: query, limit: count} = params;
      // 1. Try search in database first
      const places = await this.dbContext.places.search({ name: query, limit: count });
  
      if (places.length > 0) {
        return places;
      }
  
      // 2. If no results - search
      const foundedPlaces = await this.placeSearchService.search(params);
      if (foundedPlaces.length === 0) {
        return [];
      }
  
      // 3. Save to database
      const savedPlaces = await this.dbContext.places.save(foundedPlaces);
  
      return savedPlaces;
    }

  async getDetails(params: IPlaceDetailsParams): Promise<IPlaceDetails> {

    // 1. Execute search flow
    const placeName = params.name
    
    const places = await this.search({ name: placeName, limit: 1 });
    

    // 2. If places don't exist - throw error
    if (places.length === 0) {
      throw new NotFoundException(`Place ${placeName} not found`);
    }
    // 3. Get weather forecast for current place and date range
    const place = places[0]
    const dateRange = getDateRangeOrNextWeek(params.dateRange)
    
    const weatherForecast = await this.weatherService.getWeatherByPlace(place, dateRange);

    // 4. Get place activities accordingly weather forecast
    const activities = await this.activityScoringService.getActivities(place, weatherForecast);

    return {
      id: place.id,
      name: place.name,
      dateRange,
      activities
    }
  }
}

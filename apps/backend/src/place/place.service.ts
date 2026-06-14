import { Injectable, NotFoundException } from '@nestjs/common';
import { IPlaceDetails } from 'src/place/models/place-details';
import { IActivityScoreService } from 'src/activity/activity-scoring.service.interface';
import { IPlaceDetailsParams, IPlaceService, ISearchPlacesParams } from 'src/place/place.service.interface';
import { IPlace } from 'src/place/models/place';
import { IDBContext } from 'src/database/db-context.interface';
import { OpenMeteoPlaceSearchService } from 'src/weather/search/open-meteo-place-search.service';
import { IWeatherForecastService } from 'src/weather/weather-forecast.service.interface';
import { IDateRange } from 'src/types/date-range';

@Injectable()
export class PlaceService implements IPlaceService {
  constructor(
    private readonly weatherService: IWeatherForecastService,
    private readonly activityScoringService: IActivityScoreService,
    private readonly dbContext: IDBContext,
    private readonly openMeteoSearchService: OpenMeteoPlaceSearchService,
  ) {}

  
  async search(params : ISearchPlacesParams): Promise<IPlace[]> {
  
      const {name: query, limit: count} = params;
      // 1. Try database first
      const places = await this.dbContext.places.search({ name: query, limit: count });
  
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

    const places = await this.search({ name: placeName, limit: 1 });
    
    if (places.length === 0) {
      throw new NotFoundException(`Place ${placeName} not found`);
    }

    const place = places[0]

    const dateRange = this.getDateRangeOrNextWeek(params.dateRange)

    const weatherForecast = await this.weatherService.getWeatherByPlace(place, dateRange);

    const activities = await this.activityScoringService.getActivities(place, weatherForecast);

    return {
      id: place.id,
      name: place.name,
      dateRange,
      activities
    }
  }

  private getDateRangeOrNextWeek(dateRange?: IDateRange): IDateRange {
    if (dateRange) {
       return dateRange;
  }

  const from = new Date();
  const to = new Date(from);
  to.setDate(to.getDate() + 7);

  return { from, to };
  }
}

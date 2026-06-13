import { Injectable } from '@nestjs/common';
import { IPlaceSearchService, ISearchPlacesQueryParams } from './place-search.service.interface';
import { IPlace } from '../../weather/weather.types';
import { IDBContext } from '../../database/db-context.interface';
import { OpenMeteoPlaceSearchService } from './open-meteo-place-search.service';
import { placeEntityToIPlace } from 'src/place/models/utils/placeEntityToIPlace';

@Injectable()
export class PlaceSearchService implements IPlaceSearchService {
  constructor(
    private readonly dbContext: IDBContext,
    private readonly openMeteoSearchService: OpenMeteoPlaceSearchService,
  ) {}


  async search(params : ISearchPlacesQueryParams): Promise<IPlace[]> {

    const {query, count} = params;
    // 1. Try database first
    const dbResults = await this.dbContext.places.search({ name: query, count });
    if (dbResults.length > 0) {
      return dbResults.map(placeEntityToIPlace);
    }

    // 2. If no results, use OpenMeteo
    const openMeteoResults = await this.openMeteoSearchService.search(params);
    if (openMeteoResults.length === 0) {
      return [];
    }

      // 3. Save to database using saveMany
    const savedPlaces = await this.dbContext.places.saveMany(openMeteoResults);

    return savedPlaces.map(placeEntityToIPlace);
  }
}

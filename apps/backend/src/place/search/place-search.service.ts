import { Injectable } from '@nestjs/common';
import { IPlaceSearchService, ISearchPlacesQueryParams } from './place-search.service.interface';
import { IPlace } from "src/place/models/IPlace";
import { IDBContext } from '../../database/db-context.interface';
import { OpenMeteoPlaceSearchService } from './open-meteo-place-search.service';

@Injectable()
export class PlaceSearchService implements IPlaceSearchService {
  constructor(
    private readonly dbContext: IDBContext,
    private readonly openMeteoSearchService: OpenMeteoPlaceSearchService,
  ) {}


  async search(params : ISearchPlacesQueryParams): Promise<IPlace[]> {

    const {placeName: query, count} = params;
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

      // 3. Save to database using saveMany
    const savedPlaces = await this.dbContext.places.save(openMeteoResults);

    return savedPlaces;
  }
}

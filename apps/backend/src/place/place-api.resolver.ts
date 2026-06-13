import { Resolver, Query, Args } from '@nestjs/graphql';
import { IPlaceService } from '../place-activities/activities-ranking.service.interface';
import { IPlaceSearchService } from './search/place-search.service.interface';
import { Place } from './dto/place.dto';
import { PlaceDetailsResult } from './dto/place-details-result.dto';
import { Int } from '@nestjs/graphql';

@Resolver()
export class PlaceApiResolver {
  constructor(
    private readonly placeService: IPlaceService,
    private readonly placeSearchService: IPlaceSearchService,
  ) {}

  @Query(() => PlaceDetailsResult)
  getPlaceDetails(@Args('place') place: string) {
    return this.placeService.getDetails({ placeName: place });
  }

  @Query(() => [Place])
  async searchPlaces(
    @Args('query') query: string,
    @Args('count', { type: () => Int, nullable: true }) count?: number,
  ): Promise<Place[]> {
    return this.placeSearchService.search({ query, count });
  }
}

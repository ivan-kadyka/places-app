import { Resolver, Query, Args } from '@nestjs/graphql';
import { IPlaceService } from '../place-activities/activities-ranking.service.interface';
import { IPlaceSearchService } from './search/place-search.service.interface';
import { PlaceDto } from './dto/place.dto';
import { PlaceDetailsDto } from './dto/place-details.dto';
import { Int } from '@nestjs/graphql';

@Resolver()
export class PlaceApiResolver {
  constructor(
    private readonly placeService: IPlaceService,
    private readonly placeSearchService: IPlaceSearchService,
  ) {}

  @Query(() => PlaceDetailsDto)
  getPlaceDetails(@Args('place') place: string) {
    return this.placeService.getDetails({ placeName: place });
  }

  @Query(() => [PlaceDto])
  async searchPlaces(
    @Args('placeName') placeName: string,
    @Args('count', { type: () => Int, nullable: true }) count?: number,
  ): Promise<PlaceDto[]> {
    return this.placeSearchService.search({ placeName: placeName, count });
  }
}

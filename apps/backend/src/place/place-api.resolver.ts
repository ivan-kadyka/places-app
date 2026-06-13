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
  getPlaceDetails(@Args('name') name: string) {
    return this.placeService.getDetails({ name: name });
  }

  @Query(() => [PlaceDto])
  async searchPlaces(
    @Args('name') name: string,
    @Args('count', { type: () => Int, nullable: true }) count?: number,
  ): Promise<PlaceDto[]> {
    return this.placeSearchService.search({ name : name, count });
  }
}

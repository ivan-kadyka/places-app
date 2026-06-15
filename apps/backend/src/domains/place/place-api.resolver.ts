import { UseFilters } from '@nestjs/common';
import { Resolver, Query, Args } from '@nestjs/graphql';
import { PlaceDto } from './dto/place.dto';
import { PlaceDetailsDto } from './dto/place-details.dto';
import { Int } from '@nestjs/graphql';
import { IPlaceService } from 'src/domains/place/place.service.interface';
import { GraphqlExceptionFilter } from 'src/filters/graphql-exception.filter';

@Resolver()
@UseFilters(GraphqlExceptionFilter)
export class PlaceApiResolver {
  constructor(
    private readonly placeService: IPlaceService,
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
    return this.placeService.search({ name : name, limit: count });
  }
}

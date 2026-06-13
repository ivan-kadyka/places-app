import { Controller, Get, Query } from '@nestjs/common';
import { GetPlaceActivitiesQueryDto } from '../place-activities/dto/get-place-activities-query.dto';
import { IPlaceService } from '../place-activities/activities-ranking.service.interface';
import { IPlaceSearchService } from './search/place-search.service.interface';
import { SearchPlacesQueryDto } from './dto/search-places-query.dto';
import { IPlace } from '../weather/weather.types';

@Controller('place')
export class PlaceApiController {
  constructor(
    private readonly placeService: IPlaceService,
    private readonly placeSearchService: IPlaceSearchService,
  ) {}

  @Get('details')
  getPlaceActivities(@Query() query: GetPlaceActivitiesQueryDto) {
    return this.placeService.getDetails({ placeName: query.place });
  }

  @Get('search')
  async searchPlaces(@Query() query: SearchPlacesQueryDto): Promise<IPlace[]> {
    return this.placeSearchService.search(query.query, query.count);
  }
}



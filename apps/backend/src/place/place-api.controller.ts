import { Controller, Get, Query } from '@nestjs/common';
import { GetPlaceActivitiesQueryDto } from '../place-activities/dto/get-place-activities-query.dto';
import { SearchPlacesQueryDto } from './dto/search-places-query.dto';
import { IPlace } from "src/place/models/IPlace";
import { IPlaceService } from 'src/place/place.service.interface';

@Controller('place')
export class PlaceApiController {
  constructor(
    private readonly placeService: IPlaceService,
  ) {}

  @Get('details')
  getPlaceActivities(@Query() query: GetPlaceActivitiesQueryDto) {
    return this.placeService.getDetails({ name: query.place });
  }

  @Get('search')
  async searchPlaces(@Query() query: SearchPlacesQueryDto): Promise<IPlace[]> {
    return this.placeService.search(query);
  }
}



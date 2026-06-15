import { Controller, Get, Query } from '@nestjs/common';
import { PlaceDetailsRequestDto } from './dto/place-details-request.dto';
import { SearchPlacesQueryDto } from './dto/search-places-query.dto';
import { IPlace } from "src/domains/place/models/place";
import { IPlaceService } from 'src/domains/place/place.service.interface';

@Controller('place')
export class PlaceApiController {
  constructor(
    private readonly placeService: IPlaceService,
  ) {}

  @Get('details')
  getPlaceActivities(@Query() query: PlaceDetailsRequestDto) {
    return this.placeService.getDetails({ name: query.place });
  }

  @Get('search')
  async searchPlaces(@Query() query: SearchPlacesQueryDto): Promise<IPlace[]> {
    return this.placeService.search({ name: query.name, limit: query.count });
  }
}


import { Controller, Get, Query } from '@nestjs/common';
import { GetPlaceActivitiesQueryDto } from './dto/get-place-activities-query.dto';
import { IPlaceService } from './activities-ranking.service.interface';

@Controller('place-info')
export class PlaceInfoController {
  constructor(private readonly placeService: IPlaceService) {}

  @Get()
  getPlaceActivities(@Query() query: GetPlaceActivitiesQueryDto) {
    return this.placeService.getActivities({ place: query.place });
  }
}



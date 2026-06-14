import { Module } from '@nestjs/common';
import { PlaceApiController } from './place-api.controller';
import { PlaceApiResolver } from './place-api.resolver';
import { PlaceService } from './place.service';
import { WeatherModule } from '../weather/weather.module';
import { IPlaceService } from 'src/domains/place/place.service.interface';
import { ActivitiesModule } from 'src/domains/activities/activities.module';

@Module({
  imports: [WeatherModule, ActivitiesModule],
  controllers: [PlaceApiController],
  providers: [
    PlaceApiResolver,
    {
      provide: IPlaceService,
      useClass: PlaceService,
    }
  ],
  exports: [IPlaceService],
})
export class PlaceModule {}

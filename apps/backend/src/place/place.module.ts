import { Module } from '@nestjs/common';
import { PlaceApiController } from './place-api.controller';
import { PlaceApiResolver } from './place-api.resolver';
import { IActivityScoreService } from '../activity/activity-scoring.service.interface';
import { ActivityScoringService } from '../activity/activity-scoring.service';
import { PlaceService } from './place.service';
import { WeatherModule } from '../weather/weather.module';
import { IPlaceService } from 'src/place/place.service.interface';

@Module({
  imports: [WeatherModule],
  controllers: [PlaceApiController],
  providers: [
    PlaceApiResolver,
    {
      provide: IActivityScoreService,
      useClass: ActivityScoringService,
    },
    {
      provide: IPlaceService,
      useClass: PlaceService,
    }
  ],
  exports: [IPlaceService],
})
export class PlaceModule {}

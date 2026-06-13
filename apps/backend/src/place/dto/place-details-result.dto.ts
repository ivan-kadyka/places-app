import { ObjectType, Field, ID } from '@nestjs/graphql';
import { DateRange } from './date-range.dto';
import { Activity } from './activity.dto';

@ObjectType()
export class PlaceDetailsResult {
  @Field(() => ID)
  id: string;

  @Field()
  placeName: string;

  @Field(() => DateRange)
  dateRange: DateRange;

  @Field(() => [Activity])
  activities: Activity[];
}

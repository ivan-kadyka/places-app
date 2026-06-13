import { ObjectType, Field, ID } from '@nestjs/graphql';
import { DateRange } from './date-range.model';
import { Activity } from './activity.model';

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

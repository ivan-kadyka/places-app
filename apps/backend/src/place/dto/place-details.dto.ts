import { ObjectType, Field, ID } from '@nestjs/graphql';
import { DateRangeDto } from './date-range.dto';
import { ActivityDto } from './activity.dto';

@ObjectType()
export class PlaceDetailsDto {
  @Field(() => ID)
  id: string;

  @Field()
  placeName: string;

  @Field(() => DateRangeDto)
  dateRange: DateRangeDto;

  @Field(() => [ActivityDto])
  activities: ActivityDto[];
}

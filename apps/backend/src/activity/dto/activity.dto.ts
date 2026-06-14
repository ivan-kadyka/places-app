import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ActivityScoreDto } from './activity-score.dto';

@ObjectType()
export class ActivityDto {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => ActivityScoreDto)
  score: ActivityScoreDto;
}

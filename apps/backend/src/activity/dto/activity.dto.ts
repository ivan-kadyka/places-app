import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ActivityScoreDto } from './activity-score.dto';

@ObjectType()
export class ActivityDto {
  @Field()
  type: string;

  @Field(() => ActivityScoreDto)
  score: ActivityScoreDto;
}

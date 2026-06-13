import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ActivityScore } from './activity-score.model';

@ObjectType()
export class Activity {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => ActivityScore)
  score: ActivityScore;
}

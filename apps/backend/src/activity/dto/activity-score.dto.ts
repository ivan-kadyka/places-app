import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { RecommendationLevel } from "src/activity/models/recommendation-level";

registerEnumType(RecommendationLevel, {
  name: 'RecommendationLevel',
});

@ObjectType()
export class ActivityScoreDto {
  @Field(() => RecommendationLevel)
  type: RecommendationLevel;

  @Field(() => Int)
  percentage: number;
}

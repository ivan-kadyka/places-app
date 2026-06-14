import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { RecommendationLevel } from "src/activity/models/recommendation-level";

registerEnumType(RecommendationLevel, {
  name: 'RecommendationLevel',
});

@ObjectType()
export class ActivityScoreDto {
  @Field(() => RecommendationLevel)
  level: RecommendationLevel;

  @Field(() => Int)
  percentage: number;
}

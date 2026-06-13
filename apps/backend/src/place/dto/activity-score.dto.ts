import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { RecommendationLevel } from '../../weather/weather.types';

registerEnumType(RecommendationLevel, {
  name: 'RecommendationLevel',
});

@ObjectType()
export class ActivityScore {
  @Field(() => RecommendationLevel)
  type: RecommendationLevel;

  @Field(() => Int)
  percentage: number;
}

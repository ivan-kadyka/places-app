import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType()
export class Coordinates {
  @Field(() => Float)
  latitude: number;

  @Field(() => Float)
  longitude: number;
}

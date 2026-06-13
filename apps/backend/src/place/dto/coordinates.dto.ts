import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType()
export class CoordinatesDto {
  @Field(() => Float)
  latitude: number;

  @Field(() => Float)
  longitude: number;
}

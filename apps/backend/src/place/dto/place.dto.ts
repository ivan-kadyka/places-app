import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Coordinates } from './coordinates.dto';

@ObjectType()
export class Place {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => Coordinates)
  coordinate: Coordinates;

  @Field()
  timezone: string;

  @Field()
  countryCode: string;

  @Field(() => Float, { nullable: true })
  elevation?: number;

  @Field({ nullable: true })
  openMeteoId?: string;
}

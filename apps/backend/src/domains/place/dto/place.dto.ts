import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { CoordinatesDto } from './coordinates.dto';

@ObjectType()
export class PlaceDto {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => CoordinatesDto)
  coordinate: CoordinatesDto;

  @Field()
  timezone: string;

  @Field()
  countryCode: string;

  @Field(() => Float, { nullable: true })
  elevation?: number;

  @Field({ nullable: true })
  openMeteoId?: string;
}

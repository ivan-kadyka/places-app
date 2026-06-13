import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class DateRange {
  @Field()
  from: Date;

  @Field()
  to: Date;
}

import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class DateRangeDto {
  @Field()
  from: Date;

  @Field()
  to: Date;
}

import { IsString, MinLength } from 'class-validator';

export class GetPlaceActivitiesQueryDto {
  @IsString()
  @MinLength(2)
  place!: string;
}

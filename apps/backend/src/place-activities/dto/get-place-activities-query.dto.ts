import { IsOptional, IsString, MinLength } from 'class-validator';

export class GetPlaceActivitiesQueryDto {
  @IsString()
  @MinLength(2)
  place!: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  country_code?: string;
}

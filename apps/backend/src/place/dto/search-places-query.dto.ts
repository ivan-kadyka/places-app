import { IsString, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchPlacesQueryDto {
  @IsString()
  placeName: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  count?: number;
}

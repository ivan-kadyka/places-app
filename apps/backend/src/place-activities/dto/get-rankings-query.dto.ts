import { IsOptional, IsString, MinLength } from 'class-validator';

export class GetRankingsQueryDto {
  @IsString()
  @MinLength(2)
  city!: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  country?: string;
}

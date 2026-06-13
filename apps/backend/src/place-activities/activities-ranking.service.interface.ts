import { RankingsResponse } from '../weather/weather.types';

export abstract class IActivitiesRankingService {
  abstract getRankingsForCity(
    city: string,
    countryCode?: string,
  ): Promise<RankingsResponse>;
}

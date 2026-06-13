import {
  RankingsResponse,
  RecommendationLevel,
} from '../weather/weather.types';

export abstract class IActivitiesRankingService {
  abstract getRankingsForCity(
    city: string,
    countryCode?: string,
  ): Promise<RankingsResponse>;
}

export interface IPlaceActivitiesParams {
  place: string;
}

export interface IActivity {
  id: string;
  name: string;
  score: {
    type: RecommendationLevel;
    percentage: number;
  };
}

export interface IPlaceActivitiesResult {
  id: string;
  place: string;
  dateRange: {
    from: Date;
    to: Date;
  };
  activities: IActivity[];
}

export abstract class IPlaceService {
  abstract getActivities(
    params: IPlaceActivitiesParams,
  ): Promise<IPlaceActivitiesResult>;
}

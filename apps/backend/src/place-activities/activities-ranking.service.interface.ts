import {
  RankingsResponse,
  RecommendationLevel,
} from '../weather/weather.types';

export abstract class IActivitiesRankingService {
  abstract getPlaceDetails(
    placeId: string,
  ): Promise<RankingsResponse>;
}

export interface IPlaceDetailsParams {
  name: string;
}

export interface IActivity {
  id: string;
  name: string;
  score: {
    type: RecommendationLevel;
    percentage: number;
  };
}

export interface IPlaceDetailsResult {
  id: string;
  placeName: string;
  dateRange: {
    from: Date;
    to: Date;
  };
  activities: IActivity[];
}

export abstract class IPlaceService {
  abstract getDetails(
    params: IPlaceDetailsParams,
  ): Promise<IPlaceDetailsResult>;
}

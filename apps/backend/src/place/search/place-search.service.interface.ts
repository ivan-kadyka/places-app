import { IPlace } from '../../weather/weather.types';

export interface ISearchPlacesQueryParams {
  query: string;
  country_code?: string;
  count?: number;
}

export abstract class IPlaceSearchService {
  abstract search(params: ISearchPlacesQueryParams): Promise<IPlace[]>;
}

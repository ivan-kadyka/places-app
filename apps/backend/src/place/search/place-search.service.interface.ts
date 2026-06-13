import { IPlace } from "src/place/models/IPlace";

export interface ISearchPlacesQueryParams {
  query: string;
  country_code?: string;
  count?: number;
}

export abstract class IPlaceSearchService {
  abstract search(params: ISearchPlacesQueryParams): Promise<IPlace[]>;
}

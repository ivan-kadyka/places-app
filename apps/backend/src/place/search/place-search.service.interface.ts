import { IPlace } from "src/place/models/IPlace";

export interface ISearchPlacesQueryParams {
  name: string;
  countryCode?: string;
  count?: number;
}

export abstract class IPlaceSearchService {
  abstract search(params: ISearchPlacesQueryParams): Promise<IPlace[]>;
}

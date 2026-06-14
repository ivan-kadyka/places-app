import { IPlace } from "src/domains/place/models/place";

interface ISearchPlacesParams {
  name: string;
  countryCode?: string;
  limit?: number;
}

export abstract class IPlaceSearchService {
  abstract search(params: ISearchPlacesParams): Promise<IPlace[]>
}
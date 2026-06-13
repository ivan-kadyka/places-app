import { IPlace } from "src/place/models/IPlace";
import { IPlaceDetails } from "src/place/models/IPlaceDetails";

export interface IPlaceDetailsParams {
  name: string;
}

export interface ISearchPlacesParams {
  name: string;
  countryCode?: string;
  count?: number;
}

export abstract class IPlaceService {
  abstract getDetails(params: IPlaceDetailsParams): Promise<IPlaceDetails>
  abstract search(params: ISearchPlacesParams): Promise<IPlace[]>
}
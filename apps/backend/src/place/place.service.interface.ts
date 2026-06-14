import { IPlace } from "src/place/models/place";
import { IPlaceDetails } from "src/place/models/place-details";
import { IDateRange } from "src/types/date-range";

export interface IPlaceDetailsParams {
  name: string;
  dateRange?: IDateRange
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
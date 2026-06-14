import { IPlace } from "src/domains/place/models/place";
import { IPlaceDetails } from "src/domains/place/models/place-details";
import { IDateRange } from "src/types/date-range";

export interface IPlaceDetailsParams {
  name: string;
  dateRange?: IDateRange
}

export interface ISearchPlacesParams {
  name: string;
  countryCode?: string;
  limit?: number;
}

export abstract class IPlaceService {
  abstract search(params: ISearchPlacesParams): Promise<IPlace[]>
  abstract getDetails(params: IPlaceDetailsParams): Promise<IPlaceDetails>
}
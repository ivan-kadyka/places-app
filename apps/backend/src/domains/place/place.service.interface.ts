import { IPlace } from "src/domains/place/models/place";
import { IPlaceDetails } from "src/domains/place/models/place-details";
import { IDateRange } from "src/types/date-range";

/**
 * Parameters used to retrieve detailed information about a place.
 */
export interface IPlaceDetailsParams {
  /**
   * The place name to look up.
   */
  name: string;

  /**
   * Optional date range used to scope the details request.
   * Availability, pricing, or other time-dependent data may be
   * calculated relative to this range.
   */
  dateRange?: IDateRange;
}

/**
 * Parameters used to search for places.
 */
export interface ISearchPlacesParams {
  /**
   * The search term or place name.
   */
  name: string;

  /**
   * Optional ISO 3166-1 alpha-2 country code used to restrict
   * search results to a specific country.
   */
  countryCode?: string;

  /**
   * Maximum number of results to return.
   */
  limit?: number;
}

/**
 * Provides place search and place details operations.
 */
export abstract class IPlaceService {
  /**
   * Searches for places matching the supplied criteria.
   *
   * @param params Search parameters.
   * @returns A collection of matching places.
   */
  abstract search(params: ISearchPlacesParams): Promise<IPlace[]>;

  /**
   * Retrieves detailed information for a specific place.
   *
   * @param params Place lookup parameters.
   * @returns Detailed information about the requested place.
   */
  abstract getDetails(params: IPlaceDetailsParams): Promise<IPlaceDetails>;
}
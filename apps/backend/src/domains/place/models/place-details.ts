import { IActivity } from 'src/domains/activities/models/activity';
import { PlaceId } from 'src/domains/place/models/place';
import { IDateRange } from 'src/types/date-range';

/**
 * Detailed information about a place for a specific date range.
 */
export interface IPlaceDetails {
  /**
   * Unique identifier of the place.
   */
  id: PlaceId;

  /**
   * Display name of the place.
   */
  name: string;

  /**
   * Date range used to calculate the returned details.
   */
  dateRange: IDateRange;

  /**
   * Activities available for the place along with their recommendation scores.
   */
  activities: IActivity[];
}

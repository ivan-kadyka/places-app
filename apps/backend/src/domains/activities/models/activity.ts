import { ActivityType } from "src/domains/activities/models/activity-type";
import { RecommendationLevel } from "src/domains/activities/models/recommendation-level";

/**
 * Represents an activity and its recommendation score for a place.
 */
export interface IActivity {
  /**
   * The activity category.
   */
  type: ActivityType

  /**
   * Recommendation score for the activity.
   */
  score: {
    /**
     * Recommendation level derived from the calculated score.
     */
    level: RecommendationLevel

    /**
     * Recommendation score expressed as a percentage from 0 to 100.
     */
    percentage: number
  }
}

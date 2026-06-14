import { ActivityType } from "src/domains/activities/models/activity-type";
import { RecommendationLevel } from "src/domains/activities/models/recommendation-level";

export interface IActivity {
  type: ActivityType
  score: {
    level: RecommendationLevel
    percentage: number
  };
}

import { ActivityType } from "src/domains/activity/models/activity-type";
import { RecommendationLevel } from "src/domains/activity/models/recommendation-level";

export interface IActivity {
  type: ActivityType
  score: {
    level: RecommendationLevel
    percentage: number
  };
}

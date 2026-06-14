import { ActivityType } from "src/activity/models/activity-type";
import { RecommendationLevel } from "src/activity/models/recommendation-level";

export interface IActivity {
  type: ActivityType
  score: {
    level: RecommendationLevel
    percentage: number
  };
}

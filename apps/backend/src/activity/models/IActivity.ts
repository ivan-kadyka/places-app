import { RecommendationLevel } from 'src/weather/weather.types';

export interface IActivity {
  id: string;
  name: string;
  score: {
    type: RecommendationLevel;
    percentage: number;
  };
}

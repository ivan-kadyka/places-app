import { IActivity } from 'src/activity/models/activity';

export interface IPlaceDetails {
  id: string;
  name: string;
  dateRange: {
    from: Date;
    to: Date;
  };
  activities: IActivity[];
}

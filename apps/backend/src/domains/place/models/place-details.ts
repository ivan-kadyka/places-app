import { IActivity } from 'src/domains/activity/models/activity';

export interface IPlaceDetails {
  id: string;
  name: string;
  dateRange: {
    from: Date;
    to: Date;
  };
  activities: IActivity[];
}

import { IActivity } from 'src/activity/models/activity';

export interface IPlaceDetails {
  id: string;
  placeName: string;
  dateRange: {
    from: Date;
    to: Date;
  };
  activities: IActivity[];
}

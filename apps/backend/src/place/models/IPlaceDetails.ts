import { IActivity } from 'src/place/models/IActivity';

export interface IPlaceDetails {
  id: string;
  placeName: string;
  dateRange: {
    from: Date;
    to: Date;
  };
  activities: IActivity[];
}

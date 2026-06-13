export interface WeatherSnapshotEntity {
  id: string;
  locationId: string;
  fetchedAt: Date;
  expiresAt: Date;
  dailyData: any;
}

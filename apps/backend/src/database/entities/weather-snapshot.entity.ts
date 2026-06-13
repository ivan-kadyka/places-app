export interface WeatherSnapshotEntity {
  id: string;
  placeId: string;
  fetchedAt: Date;
  expiresAt: Date;
  dailyData: any;
}

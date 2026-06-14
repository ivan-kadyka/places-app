import { IMetaData } from "src/types/meta-data";

export interface WeatherSnapshotEntity {
  id: string
  placeId: string
  fetchedAt: Date
  expiresAt: Date
  dailyData: IMetaData
}



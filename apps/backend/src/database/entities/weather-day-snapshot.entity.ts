import { IMetaData } from "src/types/meta-data";

export interface WeatherDaySnapshotEntity {
  id: string
  providerType: string
  date: Date
  snapshot: IMetaData
  createdAt: Date
  updatedAt: Date
  placeId: string
}

export interface PlaceEntity {
  id: string;
  name: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  elevation: number | null;
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
}

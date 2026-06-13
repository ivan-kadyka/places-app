export interface PlaceEntity {
  id: string;
  openMeteoId: string | null;
  name: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  elevation: number | null;
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
}

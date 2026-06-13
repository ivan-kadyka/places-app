export interface LocationEntity {
  id: string;
  openMeteoId: number;
  name: string;
  country: string;
  countryCode: string;
  admin1: string | null;
  latitude: number;
  longitude: number;
  elevation: number | null;
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
}

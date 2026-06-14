export interface GeocodingResponse {
  results?: GeocodingResult[];
}

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  timezone: string;
  country_code: string;
  country: string;
  admin1?: string;
}

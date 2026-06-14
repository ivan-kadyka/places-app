export type PlaceId = string;

export interface IPlace {
  id: PlaceId
  name: string
  coordinate: ICoordinates
  timezone: string
  countryCode: string
  elevation?: number
}

export interface ICoordinates {
  latitude: number;
  longitude: number;
}

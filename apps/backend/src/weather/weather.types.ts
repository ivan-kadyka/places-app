export enum ActivityType {
  SKIING = 'skiing',
  SURFING = 'surfing',
  OUTDOOR_SIGHTSEEING = 'outdoor_sightseeing',
  INDOOR_SIGHTSEEING = 'indoor_sightseeing',
}

export const ACTIVITIES = Object.values(ActivityType);

export interface DailyWeatherPoint {
  date: string;
  temperatureMax: number;
  temperatureMin: number;
  precipitationSum: number;
  rainSum: number;
  snowfallSum: number;
  weatherCode: number;
  windSpeedMax: number;
  windGustsMax: number;
  sunshineDuration: number;
  precipitationProbabilityMax: number;
}

export interface OpenMeteoDailyForecast {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  rain_sum: number[];
  snowfall_sum: number[];
  weather_code: number[];
  wind_speed_10m_max: number[];
  wind_gusts_10m_max: number[];
  sunshine_duration: number[];
  precipitation_probability_max: number[];
}

export interface OpenMeteoForecastResponse {
  latitude: number;
  longitude: number;
  elevation: number;
  timezone: string;
  daily: OpenMeteoDailyForecast;
}

export interface IPlace {
  id: number;
  name: string;
  coordinate: ICoordinates;
  elevation: number;
  timezone: string;
  countryCode: string;
  country: string;
  admin1?: string;
}

export interface ICoordinates {
  latitude: number;
  longitude: number;
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

export interface GeocodingResponse {
  results?: GeocodingResult[];
}

export enum RecommendationLevel {
  Unsuitable = 1,
  Poor = 2,
  Average = 3,
  Good = 4,
  Ideal = 5,
}

export interface ActivityDayRanking {
  date: string;
  rank: number;
  score: number;
  recommendationLevel: RecommendationLevel;
  weatherCode: number;
  temperatureMax: number;
  temperatureMin: number;
  precipitationSum: number;
}

export interface ActivityRanking {
  type: ActivityType;
  days: ActivityDayRanking[];
}

export interface RankingsResponse {
  location: {
    name: string;
    country: string;
    countryCode: string;
    admin1: string | null;
    latitude: number;
    longitude: number;
    timezone: string;
  };
  forecastFetchedAt: string;
  forecastExpiresAt: string;
  cacheHit: boolean;
  rankings: ActivityRanking[];
}

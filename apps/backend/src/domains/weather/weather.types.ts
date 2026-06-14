import { ActivityType } from "src/domains/activity/models/activity-type";
import { RecommendationLevel } from "src/domains/activity/models/recommendation-level";

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
    countryCode: string;
    latitude: number;
    longitude: number;
    timezone: string;
  };
  forecastFetchedAt: string;
  forecastExpiresAt: string;
  cacheHit: boolean;
  rankings: ActivityRanking[];
}

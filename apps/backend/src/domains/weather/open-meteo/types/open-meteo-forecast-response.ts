export interface OpenMeteoForecastResponse {
  latitude: number;
  longitude: number;
  elevation: number;
  timezone: string;
  daily: OpenMeteoDailyForecast;
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


import { OpenMeteoDailyForecast, OpenMeteoForecastResponse } from "../types/open-meteo-forecast-response";
import { IDayWeatherSnapshot } from "../../models/weather-snapshot";

export function parseDailyForecast(response: OpenMeteoForecastResponse): IDayWeatherSnapshot[] {
  const { daily } = response;

  return daily.time.map((date, index) => ({
    date: new Date(date),
    temperatureMax: daily.temperature_2m_max[index],
    temperatureMin: daily.temperature_2m_min[index],
    precipitationSum: daily.precipitation_sum[index],
    rainSum: daily.rain_sum[index],
    snowfallSum: daily.snowfall_sum[index],
    weatherCode: daily.weather_code[index],
    windSpeedMax: daily.wind_speed_10m_max[index],
    windGustsMax: daily.wind_gusts_10m_max[index],
    sunshineDuration: daily.sunshine_duration[index],
    precipitationProbabilityMax: daily.precipitation_probability_max[index],
  }));
}

export function serializeDailyForecast(points: IDayWeatherSnapshot[]): OpenMeteoDailyForecast {
  return {
    time: points.map((point) => point.date.toISOString().split('T')[0]),
    temperature_2m_max: points.map((point) => point.temperatureMax),
    temperature_2m_min: points.map((point) => point.temperatureMin),
    precipitation_sum: points.map((point) => point.precipitationSum),
    rain_sum: points.map((point) => point.rainSum),
    snowfall_sum: points.map((point) => point.snowfallSum),
    weather_code: points.map((point) => point.weatherCode),
    wind_speed_10m_max: points.map((point) => point.windSpeedMax),
    wind_gusts_10m_max: points.map((point) => point.windGustsMax),
    sunshine_duration: points.map((point) => point.sunshineDuration),
    precipitation_probability_max: points.map(
      (point) => point.precipitationProbabilityMax,
    )
  };
}

export function deserializeDailyForecast(daily: OpenMeteoDailyForecast): IDayWeatherSnapshot[] {
  return parseDailyForecast({ daily } as OpenMeteoForecastResponse);
}

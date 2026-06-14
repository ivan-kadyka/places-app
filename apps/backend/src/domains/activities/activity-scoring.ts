
import { IPlace } from 'src/domains/place/models/place';
import { IDayWeatherSnapshot, IWeatherSnapshot } from "../weather/models/weather-snapshot";

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function averageTemperature(day: IWeatherSnapshot): number {
  return (day.temperatureMax + day.temperatureMin) / 2;
}

function isStormWeatherCode(code: number): boolean {
  return code >= 95;
}

export function scoreSkiing(place: IPlace, weather: IWeatherSnapshot): number {

  if (place.elevation &&  place.elevation < 200){
   return 0
  }

  const avgTemp = averageTemperature(weather);
  let score = 0;

  if (avgTemp <= -10) score += 25;
  else if (avgTemp <= -5) score += 35;
  else if (avgTemp <= 0) score += 40;
  else if (avgTemp <= 3) score += 25;
  else if (avgTemp <= 8) score += 10;

  if (weather.snowfallSum >= 10) score += 30;
  else if (weather.snowfallSum >= 3) score += 25;
  else if (weather.snowfallSum > 0) score += 15;
  else if (avgTemp <= 2) score += 5;

  if (weather.rainSum > 5) score -= 20;
  if (weather.precipitationSum > 15) score -= 15;

  if (weather.windSpeedMax > 60) score -= 15;
  else if (weather.windSpeedMax > 40) score -= 5;

  return clamp(score, 0, 100);
}

export function scoreSurfing(place: IPlace, weather: IWeatherSnapshot): number {

  if (place.elevation && place.elevation > 100){
    return 0
  }

  const avgTemp = averageTemperature(weather);
  let score = 30;

  if (weather.windSpeedMax >= 15 && weather.windSpeedMax <= 40) score += 30;
  else if (weather.windSpeedMax >= 10 && weather.windSpeedMax <= 50) score += 15;
  else if (weather.windSpeedMax > 60) score -= 20;

  if (avgTemp >= 14 && avgTemp <= 28) score += 25;
  else if (avgTemp >= 10 && avgTemp <= 32) score += 10;
  else score -= 10;

  if (weather.precipitationSum > 10) score -= 20;
  if (weather.precipitationSum > 25) score -= 20;

  return clamp(score, 0, 100);
}

// Average daily points into a single representative forecast
export function aggregateForecast(daily: IDayWeatherSnapshot[]) : IWeatherSnapshot {
  const n = daily.length;
  return {
    temperatureMax: daily.reduce((s, d) => s + d.temperatureMax, 0) / n,
    temperatureMin: daily.reduce((s, d) => s + d.temperatureMin, 0) / n,
    precipitationSum: daily.reduce((s, d) => s + d.precipitationSum, 0) / n,
    rainSum: daily.reduce((s, d) => s + d.rainSum, 0) / n,
    snowfallSum: daily.reduce((s, d) => s + d.snowfallSum, 0) / n,
    weatherCode: daily.reduce((s, d) => s + d.weatherCode, 0) / n,
    windSpeedMax: daily.reduce((s, d) => s + d.windSpeedMax, 0) / n,
    windGustsMax: daily.reduce((s, d) => s + d.windGustsMax, 0) / n,
    sunshineDuration: daily.reduce((s, d) => s + d.sunshineDuration, 0) / n,
    precipitationProbabilityMax: daily.reduce((s, d) => s + d.precipitationProbabilityMax, 0) / n,
  };
}


export function scoreOutdoorSightseeing(day: IWeatherSnapshot): number {
  let score = 50;
  const avgTemp = averageTemperature(day);

  if (avgTemp >= 15 && avgTemp <= 25) score += 25;
  else if (avgTemp >= 10 && avgTemp <= 28) score += 15;
  else if (avgTemp < 0 || avgTemp > 35) score -= 25;

  if (day.weatherCode === 0) score += 20;
  else if (day.weatherCode <= 3) score += 10;
  else if (day.weatherCode >= 61) score -= 15;
  else if (isStormWeatherCode(day.weatherCode)) score -= 25;

  if (day.precipitationSum === 0) score += 15;
  else if (day.precipitationSum < 2) score += 5;
  else if (day.precipitationSum > 10) score -= 20;

  const sunshineHours = day.sunshineDuration / 3600;
  if (sunshineHours >= 6) score += 15;
  else if (sunshineHours >= 3) score += 8;

  if (day.windSpeedMax < 25) score += 5;
  else if (day.windSpeedMax > 50) score -= 15;

  return clamp(score, 0, 100);
}

export function scoreIndoorSightseeing(weather: IWeatherSnapshot): number {
  const outdoorScore = scoreOutdoorSightseeing(weather);
  let score = 100 - outdoorScore * 0.7;
  const avgTemp = averageTemperature(weather);

  if (weather.precipitationSum > 15) score += 15;
  if (isStormWeatherCode(weather.weatherCode)) score += 10;
  if (avgTemp < 5 || avgTemp > 32) score += 10;

  return clamp(score, 0, 100);
}

export const activityScorers = {
  skiing: scoreSkiing,
  surfing: scoreSurfing,
  outdoor_sightseeing: scoreOutdoorSightseeing,
  indoor_sightseeing: scoreIndoorSightseeing,
} as const;

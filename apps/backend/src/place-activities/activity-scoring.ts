import { DailyWeatherPoint } from '../weather/weather.types';

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function averageTemperature(day: DailyWeatherPoint): number {
  return (day.temperatureMax + day.temperatureMin) / 2;
}

function isSnowWeatherCode(code: number): boolean {
  return [71, 73, 75, 77, 85, 86].includes(code);
}

function isClearWeatherCode(code: number): boolean {
  return code >= 0 && code <= 3;
}

function isStormWeatherCode(code: number): boolean {
  return code >= 95;
}

export function scoreSkiing(day: DailyWeatherPoint): number {
  const avgTemp = averageTemperature(day);
  let score = 0;

  if (avgTemp <= -10) score += 25;
  else if (avgTemp <= -5) score += 35;
  else if (avgTemp <= 0) score += 40;
  else if (avgTemp <= 3) score += 25;
  else if (avgTemp <= 8) score += 10;

  if (day.snowfallSum >= 10) score += 30;
  else if (day.snowfallSum >= 3) score += 25;
  else if (day.snowfallSum > 0) score += 15;
  else if (avgTemp <= 2) score += 5;

  if (isSnowWeatherCode(day.weatherCode)) score += 15;

  if (day.rainSum > 5) score -= 20;
  if (day.precipitationSum > 15) score -= 15;

  if (day.windSpeedMax > 60) score -= 15;
  else if (day.windSpeedMax > 40) score -= 5;

  return clamp(score, 0, 100);
}

export function scoreSurfing(day: DailyWeatherPoint): number {
  const avgTemp = averageTemperature(day);
  let score = 30;

  if (day.windSpeedMax >= 15 && day.windSpeedMax <= 40) score += 30;
  else if (day.windSpeedMax >= 10 && day.windSpeedMax <= 50) score += 15;
  else if (day.windSpeedMax > 60) score -= 20;

  if (avgTemp >= 14 && avgTemp <= 28) score += 25;
  else if (avgTemp >= 10 && avgTemp <= 32) score += 10;
  else score -= 10;

  if (isClearWeatherCode(day.weatherCode)) score += 10;

  if (isStormWeatherCode(day.weatherCode)) score -= 30;
  if (day.precipitationSum > 10) score -= 20;
  if (day.precipitationSum > 25) score -= 20;

  return clamp(score, 0, 100);
}

export function scoreOutdoorSightseeing(day: DailyWeatherPoint): number {
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

export function scoreIndoorSightseeing(day: DailyWeatherPoint): number {
  const outdoorScore = scoreOutdoorSightseeing(day);
  let score = 100 - outdoorScore * 0.7;
  const avgTemp = averageTemperature(day);

  if (day.precipitationSum > 15) score += 15;
  if (isStormWeatherCode(day.weatherCode)) score += 10;
  if (avgTemp < 5 || avgTemp > 32) score += 10;

  return clamp(score, 0, 100);
}

export const activityScorers = {
  skiing: scoreSkiing,
  surfing: scoreSurfing,
  outdoor_sightseeing: scoreOutdoorSightseeing,
  indoor_sightseeing: scoreIndoorSightseeing,
} as const;

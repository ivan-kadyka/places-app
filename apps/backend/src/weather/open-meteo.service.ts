import { Injectable, Logger } from '@nestjs/common';
import {
  GeocodingResponse,
  GeocodingResult,
  OpenMeteoForecastResponse,
} from './weather.types';

const GEOCODING_BASE = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_BASE = 'https://api.open-meteo.com/v1/forecast';

const DAILY_VARIABLES = [
  'weather_code',
  'temperature_2m_max',
  'temperature_2m_min',
  'precipitation_sum',
  'rain_sum',
  'snowfall_sum',
  'wind_speed_10m_max',
  'wind_gusts_10m_max',
  'sunshine_duration',
  'precipitation_probability_max',
].join(',');

@Injectable()
export class OpenMeteoService {
  private readonly logger = new Logger(OpenMeteoService.name);

  async geocodeCity(
    name: string,
    countryCode?: string,
  ): Promise<GeocodingResult | null> {
    const params = new URLSearchParams({
      name: name.trim(),
      count: '5',
      language: 'en',
      format: 'json',
    });

    if (countryCode) {
      params.set('countryCode', countryCode.toUpperCase());
    }

    const url = `${GEOCODING_BASE}?${params.toString()}`;
    this.logger.debug(`Geocoding: ${url}`);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Geocoding failed with status ${response.status}`);
    }

    const data = (await response.json()) as GeocodingResponse;
    if (!data.results?.length) {
      return null;
    }

    const normalizedName = name.trim().toLowerCase();
    const exactMatch = data.results.find(
      (result) => result.name.toLowerCase() === normalizedName,
    );

    return exactMatch ?? data.results[0];
  }

  async fetchForecast(
    latitude: number,
    longitude: number,
    timezone: string,
  ): Promise<OpenMeteoForecastResponse> {
    const params = new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      timezone,
      forecast_days: '7',
      daily: DAILY_VARIABLES,
    });

    const url = `${FORECAST_BASE}?${params.toString()}`;
    this.logger.debug(`Fetching forecast: ${url}`);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Forecast fetch failed with status ${response.status}`);
    }

    return (await response.json()) as OpenMeteoForecastResponse;
  }
}

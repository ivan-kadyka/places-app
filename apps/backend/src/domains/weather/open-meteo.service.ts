import { Injectable, Logger } from '@nestjs/common';
import { OpenMeteoForecastResponse} from './weather.types';

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

  async fetchForecast(
    latitude: number,
    longitude: number,
    timezone: string,
    forecastDays: number
  ): Promise<OpenMeteoForecastResponse> {
    const params = new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      timezone,
      forecast_days: forecastDays.toString(),
      daily: DAILY_VARIABLES,
    });

    const url = `${FORECAST_BASE}?${params.toString()}`;
    this.logger.debug(`Fetching forecast: ${url}`);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Forecast fetch failed with status ${response.status}`);
    }

    const result = await response.json()  as OpenMeteoForecastResponse

    return result
  }
}

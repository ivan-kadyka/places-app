import { Injectable } from '@nestjs/common';
import { IPlaceSearchService } from './place-search.service.interface';
import { IPlace } from '../../weather/weather.types';

const GEOCODING_BASE = 'https://geocoding-api.open-meteo.com/v1/search';

interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  timezone: string;
  country_code: string;
  country: string;
}

interface GeocodingResponse {
  results?: GeocodingResult[];
}

@Injectable()
export class OpenMeteoPlaceSearchService implements IPlaceSearchService {
 
  async search(query: string, count: number = 5): Promise<IPlace[]> {
    const params = new URLSearchParams({
      name: query.trim(),
      count: String(count),
      language: 'en',
      format: 'json',
    });

    const url = `${GEOCODING_BASE}?${params.toString()}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Place search failed with status ${response.status}`);
    }

    const data = (await response.json()) as GeocodingResponse;
    if (!data.results?.length) {
      return [];
    }

    return data.results.map((result) => ({
      id: result.id.toString(),
      name: result.name,
      coordinate: {
        latitude: result.latitude,
        longitude: result.longitude,
      },
      elevation: result.elevation,
      timezone: result.timezone,
      countryCode: result.country_code,
      country: result.country
    }));
  }
}

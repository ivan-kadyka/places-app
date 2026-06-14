import { Injectable } from '@nestjs/common';
import { GeocodingResponse } from './dto/open-meteo-geocoding-response';
import { IPlace } from "src/domains/place/models/place";
import { ISearchPlacesParams } from 'src/domains/place/place.service.interface';
import { IPlaceSearchService } from 'src/domains/place/search/place-search.service.interface';

const GEOCODING_BASE = 'https://geocoding-api.open-meteo.com/v1/search';

@Injectable()
export class OpenMeteoPlaceSearchService implements IPlaceSearchService {
 
  async search({name, limit = 5 } : ISearchPlacesParams): Promise<IPlace[]> {

    const params = new URLSearchParams({
      name: name.trim(),
      count: String(limit),
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
      openMeteoId: result.id.toString(),
    }));
  }
}

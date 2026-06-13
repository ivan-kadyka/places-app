import { IPlace } from '../../weather/weather.types';

export abstract class IPlaceSearchService {
  abstract search(query: string, count?: number): Promise<IPlace[]>;
}

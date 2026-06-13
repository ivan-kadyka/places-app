import { IPlace } from 'src/weather/weather.types';
import { PlaceEntity } from '../entities/place.entity';
export abstract class IPlaceRepository {
  abstract findById(id: string): Promise<PlaceEntity | null>;
  abstract findByOpenMeteoId(openMeteoId: string): Promise<PlaceEntity | null>;
  abstract search(params: ISearchRepositoryParams): Promise<PlaceEntity[]>;
  abstract saveMany(places: IPlace[]): Promise<PlaceEntity[]>;
}

export interface ISearchRepositoryParams {
  name: string,
  count?: number,
}
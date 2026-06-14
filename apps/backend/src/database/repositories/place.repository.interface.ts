import { IPlace } from "src/place/models/place";

export interface ISearchRepositoryParams {
  name: string,
  limit?: number,
}
export abstract class IPlaceRepository {
  abstract findById(id: string): Promise<IPlace | null>;
  abstract search(params: ISearchRepositoryParams): Promise<IPlace[]>;
  abstract save(places: IPlace[]): Promise<IPlace[]>;
}
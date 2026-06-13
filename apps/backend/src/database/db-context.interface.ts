import { ILocationRepository } from './repositories/location.repository.interface';
import { IWeatherSnapshotRepository } from './repositories/weather-snapshot.repository.interface';

export abstract class IDBContext {
  abstract readonly locations: ILocationRepository;
  abstract readonly weatherSnapshots: IWeatherSnapshotRepository;
  abstract runInTransaction<T>(work: (context: IDBContext) => Promise<T>): Promise<T>;
}

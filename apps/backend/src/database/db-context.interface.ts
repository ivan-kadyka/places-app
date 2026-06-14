import { IPlaceRepository } from './repositories/place.repository.interface';
import { IWeatherSnapshotRepository } from './repositories/weather-snapshot.repository.interface';
import { IWeatherDaySnapshotRepository } from './repositories/weather-day-snapshot.repository.interface';

export abstract class IDBContext {
  abstract readonly places: IPlaceRepository;
  abstract readonly weatherSnapshots: IWeatherSnapshotRepository;
  abstract readonly weatherDaySnapshots: IWeatherDaySnapshotRepository;
  abstract runInTransaction<T>(work: (context: IDBContext) => Promise<T>): Promise<T>;
}

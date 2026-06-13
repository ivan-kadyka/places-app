import { WeatherSnapshotEntity } from '../entities/weather-snapshot.entity';

export abstract class IWeatherSnapshotRepository {
  abstract findLatestActive(placeId: string, now: Date): Promise<WeatherSnapshotEntity | null>;
  abstract create(data: Omit<WeatherSnapshotEntity, 'id' | 'fetchedAt'> & { fetchedAt?: Date }): Promise<WeatherSnapshotEntity>;
}

import { LocationEntity } from '../entities/location.entity';
import { WeatherSnapshotEntity } from '../entities/weather-snapshot.entity';

export abstract class ILocationRepository {
  abstract findById(id: string): Promise<LocationEntity | null>;
  abstract findByOpenMeteoId(openMeteoId: number): Promise<LocationEntity | null>;
  abstract upsert(
    openMeteoId: number,
    createData: Omit<LocationEntity, 'id' | 'createdAt' | 'updatedAt' | 'openMeteoId'>,
    updateData: Partial<Omit<LocationEntity, 'id' | 'createdAt' | 'updatedAt' | 'openMeteoId'>>,
  ): Promise<LocationEntity>;
  abstract findStaleLocations(now: Date): Promise<(LocationEntity & { snapshots: WeatherSnapshotEntity[] })[]>;
}

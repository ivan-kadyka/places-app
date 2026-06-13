import { PlaceEntity } from '../entities/place.entity';
import { WeatherSnapshotEntity } from '../entities/weather-snapshot.entity';

export abstract class IPlaceRepository {
  abstract findById(id: string): Promise<PlaceEntity | null>;
  abstract findByOpenMeteoId(openMeteoId: number): Promise<PlaceEntity | null>;
  abstract upsert(
    openMeteoId: number,
    createData: Omit<PlaceEntity, 'id' | 'createdAt' | 'updatedAt' | 'openMeteoId'>,
    updateData: Partial<Omit<PlaceEntity, 'id' | 'createdAt' | 'updatedAt' | 'openMeteoId'>>,
  ): Promise<PlaceEntity>;
  abstract findStaleLocations(now: Date): Promise<(PlaceEntity & { snapshots: WeatherSnapshotEntity[] })[]>;
}
